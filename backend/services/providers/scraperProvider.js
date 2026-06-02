import axios from 'axios';
import * as cheerio from 'cheerio';

const parseNumber = (value) => {
  const match = String(value || '').replace(/,/g, '').match(/[\d.]+/);
  return match ? Number(match[0]) : 0;
};

const buildCarFromCard = ($, element, sourceUrl, index) => {
  const card = $(element);
  const title = card.find('[data-car-title], .car-title, h2, h3').first().text().trim();
  const [brand, ...modelParts] = title.split(/\s+/);
  const model = modelParts.join(' ');
  const priceText = card.find('[data-price], .price, .car-price').first().text();
  const image = card.find('img').first().attr('src') || card.find('img').first().attr('data-src');
  const fuelText = card.find('[data-fuel], .fuel').first().text().trim();
  const transmissionText = card.find('[data-transmission], .transmission').first().text().trim();

  if (!brand || !model || !image) return null;

  const sourceId = `${sourceUrl}-${title}-${index}`.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  return {
    source: 'configured-scraper',
    sourceId,
    slug: sourceId,
    brand,
    model,
    type: 'SUV',
    condition: sourceUrl.includes('used') ? 'used' : 'new',
    price_in_lakhs: parseNumber(priceText),
    mileage_kmpl: parseNumber(card.find('[data-mileage], .mileage').first().text()),
    fuel_type: fuelText || 'Petrol',
    transmission: transmissionText || 'Manual',
    image_url: image,
    year: new Date().getFullYear(),
    ownerCount: sourceUrl.includes('used') ? 1 : 0,
    kilometersDriven: parseNumber(card.find('[data-km], .kilometers').first().text()),
    specs: {},
    features: [],
    sourceUrl,
    lastSyncedAt: new Date(),
  };
};

export const fetchScrapedCars = async () => {
  const urls = (process.env.SCRAPER_SOURCE_URLS || '')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean);

  if (!urls.length) return [];

  const results = [];

  for (const url of urls) {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        'User-Agent': 'LaMasiaMotorsAI/1.0 (+contact: admin@example.com)',
      },
    });
    const $ = cheerio.load(response.data);
    $('[data-car-card], .car-card, article').each((index, element) => {
      const car = buildCarFromCard($, element, url, index);
      if (car) results.push(car);
    });
  }

  return results;
};
