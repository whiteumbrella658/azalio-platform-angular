import { v4 as uuid } from 'uuid';
export interface IConfiguration {
  environment: string;
  BE_URL: string;
  API_KEY: string;
  AUTH_DOMAIN: string;
  PROJECT_ID: string;
  STORAGE_BUCKET: string;
  MESSAGING_SENDER_ID: string;
  APP_ID: string;
  MEASUREMENT_ID: string;
}

// Extract the IConfiguration interface from the global
// window variable 'dynamic_configuration'.
// console.log('window: ', window['dynamic_configuration']);
export const config: IConfiguration = window['dynamic_configuration'];
export const applicationId = uuid();
