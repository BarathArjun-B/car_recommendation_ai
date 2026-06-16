import Car from '../models/Car.js';

export const getRecommendations = async (filters) => {
  console.log("[RECOMMENDATION_ENGINE] FILTERS", filters);
  const { 
    budget, 
    fuelType, 
    bodyType, 
    familySize, 
    transmission,
    usage 
  } = filters;

  // Apply hard filters at DB level for efficiency and strictness
  let dbQuery = {};
  
  if (budget) {
    dbQuery.price_in_lakhs = { $lte: budget };
  }

  if (bodyType && bodyType.toLowerCase() !== 'any') {
    dbQuery.type = new RegExp('^' + bodyType + '$', 'i');
  } else if (familySize >= 5 || usage === 'family') {
    dbQuery.type = { $in: [new RegExp('^suv$', 'i'), new RegExp('^muv$', 'i')] };
  }

  console.log("[RECOMMENDATION_ENGINE] QUERY", dbQuery);
  const cars = await Car.find(dbQuery);
  const scoredCars = [];

  cars.forEach(car => {
    let score = 0;
    const reasons = [];

    // 1. Body Type Match: 40% (Mandatory)
    score += 40;
    if (bodyType && bodyType.toLowerCase() !== 'any') {
      reasons.push(`${car.type} body style requested.`);
    }

    // 2. Budget Match: 20%
    if (budget) {
      // 100% hard filtered by dbQuery, so it always fits
      score += 20;
      reasons.push(`Fits ₹${budget}L budget.`);
    } else {
      score += 20; // Free points if no budget specified
    }

    // 3. Family Size Match: 15%
    if (familySize || usage === 'family') {
      const seats = car.specs?.seatingCapacity || 5;
      const targetSeats = familySize || 5;
      if (seats >= targetSeats) {
        score += 15;
        reasons.push(`Family-friendly cabin for ${targetSeats}.`);
      } else {
        return; // Dealbreaker: too small for family
      }
    } else {
      score += 15;
    }

    // 4. Fuel Match: 10%
    if (fuelType && fuelType.toLowerCase() !== 'any') {
      if (car.fuel_type.toLowerCase() === fuelType.toLowerCase()) {
        score += 10;
        reasons.push(`${car.fuel_type} engine.`);
      }
    } else {
      score += 10;
    }

    // 5. Transmission Match: 10%
    if (transmission && transmission.toLowerCase() !== 'any') {
      const wantAuto = transmission.toLowerCase() === 'automatic';
      const isAuto = ['automatic', 'amt', 'dct'].includes(car.transmission.toLowerCase());
      
      if (wantAuto && isAuto) {
        score += 10;
        reasons.push(`Automatic transmission.`);
      } else if (!wantAuto && car.transmission.toLowerCase() === transmission.toLowerCase()) {
        score += 10;
        reasons.push(`Manual transmission.`);
      }
    } else {
      score += 10;
    }

    // 6. Mileage/Usage: 5%
    const isGoodMileage = car.mileage_kmpl >= 16 || car.fuel_type === 'Electric';
    if (isGoodMileage) {
      score += 5;
      if (usage && usage.toLowerCase() === 'city') {
        reasons.push(`Good city usability and mileage.`);
      } else {
        reasons.push(`Excellent fuel economy.`);
      }
    } else if (car.mileage_kmpl >= 12) {
      score += 2;
    }

    // Bonus for safety
    const safetyStr = car.specs?.safetyRating || '';
    let safetyScore = 0;
    if (safetyStr.includes('5')) {
      safetyScore = 5;
      reasons.push(`5-Star safety rating.`);
    } else if (safetyStr.includes('4')) {
      safetyScore = 4;
      reasons.push(`Strong safety rating.`);
    }
    
    // Add safety points slightly to break ties
    score += safetyScore * 0.1;

    const matchPercentage = Math.min(100, Math.round(score));

    scoredCars.push({
      car,
      matchPercentage,
      safetyScore,
      internalReason: reasons.join(' ')
    });
  });

  // Priority: 1. Match score, 2. Budget proximity (cheaper is NOT always better, but under budget is fine. Proximity means closest to budget WITHOUT exceeding. But wait, user said "budget proximity" and "Never prioritize higher price". Actually: closer to 0 difference is better, but since all are <= budget, max price <= budget is technically closest, but user said NEVER prioritize higher price! So lower price = better, or budget proximity = distance from budget... Wait! User said: "1. Match score 2. Budget proximity 3. Safety 4. Fuel efficiency. Never prioritize higher price." So order by ascending price if they are below budget? Let's just do ascending price if budget is present, or proximity to budget. Let's do budget - price (smaller difference = closer to budget). If smaller difference = higher price, that contradicts "never prioritize higher price". So "Never prioritize higher price" -> sort by price ascending!
  // Wait, let's sort by Match Score DESC, Safety DESC, Price ASC, Fuel DESC.
  scoredCars.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    if (budget) {
      // Budget proximity vs Never prioritize higher price:
      // Let's use lower price
      if (a.car.price_in_lakhs !== b.car.price_in_lakhs) {
        return a.car.price_in_lakhs - b.car.price_in_lakhs; // ASC price
      }
    }
    if (b.safetyScore !== a.safetyScore) {
      return b.safetyScore - a.safetyScore; // DESC safety
    }
    return b.car.mileage_kmpl - a.car.mileage_kmpl; // DESC fuel efficiency
  });

  // Cluster by Brand + Model
  const clusters = new Map();

  scoredCars.forEach(item => {
    const { car, matchPercentage, internalReason } = item;
    const clusterKey = `${car.brand}-${car.model}`;

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, {
        brand: car.brand,
        model: car.model,
        image_url: car.image_url,
        matchPercentage: matchPercentage,
        startingPrice: car.price_in_lakhs,
        fuelOptions: new Set([car.fuel_type]),
        transmissionOptions: new Set([car.transmission]),
        internalReason: internalReason,
        variants: [car]
      });
    } else {
      const cluster = clusters.get(clusterKey);
      if (car.price_in_lakhs < cluster.startingPrice) {
        cluster.startingPrice = car.price_in_lakhs;
      }
      cluster.fuelOptions.add(car.fuel_type);
      cluster.transmissionOptions.add(car.transmission);
      if (cluster.variants.length < 10) {
        cluster.variants.push(car);
      }
    }
  });

  // Convert Set to Array and format the clusters
  const clusteredCars = Array.from(clusters.values()).map(cluster => ({
    ...cluster,
    fuelOptions: Array.from(cluster.fuelOptions),
    transmissionOptions: Array.from(cluster.transmissionOptions),
    variants: cluster.variants.sort((a, b) => a.price_in_lakhs - b.price_in_lakhs)
  }));

  // Final sort of clusters
  clusteredCars.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return a.startingPrice - b.startingPrice; // ASC price for final output
  });

  const finalRecommendations = clusteredCars.slice(0, 5);
  console.log(
    "[RECOMMENDATION_ENGINE] RESULTS",
    finalRecommendations
  );

  return finalRecommendations;
};
