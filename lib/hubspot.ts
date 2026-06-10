import { Client } from '@hubspot/api-client';

const accessToken = process.env.HUBSPOT_ACCESS_TOKEN;

if (!accessToken) {
  console.warn(
    'HUBSPOT_ACCESS_TOKEN is not defined in environment variables. HubSpot integration will fail.'
  );
}

// Singleton HubSpot client
export const hubspotClient = new Client({
  accessToken: accessToken || '',
});
