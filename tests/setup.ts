/**
 * Runs before every test file: the store adapter reads these variables on each
 * call, so clearing them keeps the suite on the in-memory store and makes it
 * impossible for a test to touch the production database.
 */
const EXTERNAL_STORE_VARS = [
  "DATABASE_URL",
  "KV_REST_API_URL",
  "KV_REST_API_TOKEN",
  "UPSTASH_REDIS_REST_URL",
  "UPSTASH_REDIS_REST_TOKEN",
];

for (const name of EXTERNAL_STORE_VARS) {
  delete process.env[name];
}
