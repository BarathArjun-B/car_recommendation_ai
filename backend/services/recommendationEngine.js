import Car from '../models/Car.js';

export const getRecommendations = async (filters) => {
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
  if (bodyType && bodyType.toLowerCase() !== 'any') {
    dbQuery.type = new RegExp('^' + bodyType + '$', 'i');
  } else if (familySize > 5) {
    dbQuery.type = { $in: [new RegExp('^suv$', 'i'), new RegExp('^muv$', 'i')] };
  }

  const cars = await Car.find(dbQuery);
  const scoredCars = [];

  cars.forEach(car => {
    let score = 0;
    const reasons = [];

    // 1. Body Type Match: 40% (Mandatory)
    // If it passed the dbQuery, it gets the 40 points automatically.
    // If bodyType was 'any' and familySize <= 5, they still get 40 points since they didn't care.
    score += 40;
    if (bodyType && bodyType.toLowerCase() !== 'any') {
      reasons.push(`${car.type} body style requested.`);
    }

    // 2. Budget Match: 20%
    if (budget) {
      if (car.price_in_lakhs <= budget) {
        score += 20;
        reasons.push(`Fits ₹${budget}L budget.`);
      } else if (car.price_in_lakhs <= budget * 1.15) {
        score += 10; // Partial score for slight stretch
        reasons.push(`Slightly above budget but high value.`);
      } else {
        return; // Absolute dealbreaker if >15% over budget
      }
    } else {
      score += 20; // Free points if no budget specified
    }

    // 3. Family Size Match: 15%
    if (familySize) {
      const seats = car.specs?.seatingCapacity || 5;
      if (seats >= familySize) {
        score += 15;
        reasons.push(`Family-friendly cabin for ${familySize}.`);
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

    // Bonus for safety (doesn't exceed 100 max due to rounding/clamping, but ensures tie breaks)
    const safetyStr = car.specs?.safetyRating || '';
    if (safetyStr.includes('5') || safetyStr.includes('4')) {
      reasons.push(`Strong safety rating.`);
    }

    const matchPercentage = Math.min(100, Math.round(score));

    scoredCars.push({
      car,
      matchPercentage,
      internalReason: reasons.join(' ')
    });
  });

  // Sort descending by score initially, break ties by recommending the most premium car that fits the budget
  scoredCars.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return b.car.price_in_lakhs - a.car.price_in_lakhs;
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
        matchPercentage: matchPercentage, // First one has highest score due to prior sort
        startingPrice: car.price_in_lakhs,
        fuelOptions: new Set([car.fuel_type]),
        transmissionOptions: new Set([car.transmission]),
        internalReason: internalReason, // Use the reason of the highest scoring variant
        variants: [car]
      });
    } else {
      const cluster = clusters.get(clusterKey);
      if (car.price_in_lakhs < cluster.startingPrice) {
        cluster.startingPrice = car.price_in_lakhs;
      }
      cluster.fuelOptions.add(car.fuel_type);
      cluster.transmissionOptions.add(car.transmission);
      // We limit to max 10 variants per cluster to prevent massive payloads if they search "any"
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
    // Ensure nested variants are sorted by price ascending
    variants: cluster.variants.sort((a, b) => a.price_in_lakhs - b.price_in_lakhs)
  }));

  // Sort clusters by max match percentage, then by price descending
  clusteredCars.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    return b.startingPrice - a.startingPrice;
  });

  return clusteredCars.slice(0, 5);
};
