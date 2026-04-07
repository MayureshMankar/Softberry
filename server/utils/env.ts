import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.string().transform(Number).default("4000"),
  MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters long"),
  // Optional: separate JWT secret (falls back to SESSION_SECRET)
  JWT_SECRET: z.string().min(32).optional(),
  ALLOWED_ORIGINS: z.string().optional().default(""),
  // Add other required env vars here (e.g., Razorpay, Email configs)
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  EMAIL_USER: z.string().email().optional(),
  EMAIL_PASS: z.string().optional(),
  RENDER: z.string().optional(), // Add RENDER environment variable
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (): Env => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map((issue) => issue.path.join(".")).join(", ");
      console.error(`❌ Invalid or missing environment variables: ${missingVars}`);
      process.exit(1);
    }
    throw error;
  }
};
