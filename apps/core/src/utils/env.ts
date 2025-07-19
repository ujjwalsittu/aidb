import dotenv from "dotenv";
dotenv.config();

function required(key: string, fallback?: string) {
  if (process.env[key] === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing env: ${key}`);
  }
  return process.env[key] as string;
}

export const env = {
  ENV: process.env.NODE_ENV ?? "development",
  PORT: +(process.env.PORT ?? "5000"),
  JWT_SECRET: required("JWT_SECRET", "changeme_jwt"),

  DB_URL: required("AIDB_CORE_DB_URL"),

  STORAGE_PROVIDER: required("AIDB_STORAGE_PROVIDER"),
  AWS: {
    KEY: process.env.AWS_ACCESS_KEY_ID,
    SECRET: process.env.AWS_SECRET_ACCESS_KEY,
    BUCKET: process.env.AWS_S3_BUCKET,
    REGION: process.env.AWS_REGION,
  },
  AZURE: {
    ACCOUNT: process.env.AZURE_STORAGE_ACCOUNT,
    KEY: process.env.AZURE_STORAGE_ACCESS_KEY,
    CONTAINER: process.env.AZURE_STORAGE_CONTAINER,
  },
  GCP: {
    BUCKET: process.env.GCP_STORAGE_BUCKET,
    CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  },

  STRIPE_SECRET: required("STRIPE_SECRET"),
  STRIPE_WEBHOOK: required("STRIPE_WEBHOOK_SECRET"),
  RAZORPAY_KEY_ID: required("RAZORPAY_KEY_ID"),
  RAZORPAY_KEY_SECRET: required("RAZORPAY_KEY_SECRET"),
  BILLING_WEBHOOK: required("BILLING_WEBHOOK_SECRET"),
};
