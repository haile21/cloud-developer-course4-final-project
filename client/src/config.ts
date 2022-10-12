// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = ''
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-ovwchvz2.us.auth0.com',            // Auth0 domain :Haile
  clientId: 'fPEY0YSKolQ4vzJd4uh5cdJhEq6i81D7',          // Auth0 client id: Haile
  callbackUrl: 'http://localhost:3000/callback'
}
