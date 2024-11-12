import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
dotenv.config({ path: path.resolve(__dirname, "environments/.env.local") });

const nextConfig = {
  env: {
    REACT_APP_BASE_API_URL: process.env.REACT_APP_BASE_API_URL,
  },
};

export default nextConfig;
