// Replace all environment variables with placeholders
// that will be populated by the deployment.
dynamic_configuration = {
  environment: "{AppEnvironment}",
  BE_URL: "{BE_URL}",
  API_KEY: "{API_KEY}",
  AUTH_DOMAIN: "{AUTH_DOMAIN}",
  PROJECT_ID: "{PROJECT_ID}",
  STORAGE_BUCKET: "{STORAGE_BUCKET}",
  MESSAGING_SENDER_ID: "{MESSAGING_SENDER_ID}",
  APP_ID: "{APP_ID}",
  MEASUREMENT_ID: "{MEASUREMENT_ID}",
};
