import dotenv from 'dotenv';
dotenv.config();

export const validateEnv = () => {
  const requiredVars = ['MONGO_URI', 'PORT', 'JWT_SECRET', 'JWT_EXPIRES_IN', 'FRONTEND_URL'];
  const optionalVars = ['API_NINJAS_KEY', 'UNSPLASH_ACCESS_KEY', 'GEMINI_API_KEY'];

  const missingRequired = requiredVars.filter((v) => !process.env[v] || process.env[v].trim() === '');
  if (missingRequired.length > 0) {
    console.error(`[FATAL] Missing required environment variables: ${missingRequired.join(', ')}`);
    process.exit(1);
  }

  // Type & Format Validations
  if (isNaN(Number(process.env.PORT))) {
    console.error('[FATAL] Invalid PORT format. Must be a number.');
    process.exit(1);
  }

  if (!process.env.MONGO_URI.startsWith('mongodb')) {
    console.error('[FATAL] Invalid MONGO_URI format. Must start with "mongodb".');
    process.exit(1);
  }

  const missingOptional = optionalVars.filter((v) => !process.env[v] || process.env[v].includes('your_'));
  if (missingOptional.length > 0) {
    console.warn(`[WARN] Missing or default optional enrichment variables: ${missingOptional.join(', ')}. Enrichment will gracefully degrade.`);
  } else {
    console.log('[INFO] All environment variables (including enrichment keys) are valid and loaded securely.');
  }
};
