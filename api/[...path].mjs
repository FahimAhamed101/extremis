import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { forwardToBackend } = require("../backend/src/vercel/forwardToBackend");

export default async function handler(req, res) {
  return forwardToBackend(req, res);
}
