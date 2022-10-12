import 'source-map-support/register';
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import JwksRsa, { CertSigningKey } from 'jwks-rsa';
import { createLogger } from '../../utils/logger';
import { JwtPayload } from './jwt';


const logger = createLogger('auth')

// TODO: Provide a URL that can be used to download a certificate that can be used
// to verify JWT token signature.
// To get this URL you need to go to an Auth0 page -> Show Advanced Settings -> Endpoints -> JSON Web Key Set
//const jwksUrl = 'https://dev-ovwchvz2.us.auth0.com/.well-known/jwks.json'  //=>haile
//const jwksClient = new JwksClient(jwksUrl);


//const logger = createLogger('auth');

export const handler = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<APIGatewayAuthorizerResult> => {
  logger.info('Authorizing an user', event.authorizationToken);
  try {
    const jwtToken = await verifyToken(event.authorizationToken);
    logger.info('User was authorized', jwtToken);

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    };
  } catch (error) {
    logger.error('User not authorized', { error: error.message });

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    };
  }
};

function getToken(authHeader: string): string {
  if (!authHeader) throw new Error('No authentication header');
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    throw new Error('Invalid authentication header');
  }
  const jwtArr = authHeader.split(' ');
  const token = jwtArr[1];
  return token;
}

async function verifyToken(authHeader: string): Promise<JwtPayload> {
  const token = getToken(authHeader);

  // Auth0 certificate to verify JWT token signature
  // Auth0: Advanced Settings: Endpoints: JSON Web Key Set
  const client = JwksRsa({ jwksUri: 'https://dev-ovwchvz2.us.auth0.com/.well-known/jwks.json' });
  const kid = 'fPEY0YSKolQ4vzJd4uh5cdJhEq6i81D7'; 
  const certSigningKey = (await client.getSigningKeyAsync(kid)) as CertSigningKey;

  return verify(token, certSigningKey.publicKey, { algorithms: ['RS256'] }) as JwtPayload;
}