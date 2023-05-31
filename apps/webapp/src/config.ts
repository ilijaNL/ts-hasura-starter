import env from '@beam-australia/react-env';

type EnvKeys = 'API' | 'CDN' | 'BASE_DOMAIN' | 'AUTH_ENDPOINT';

export default function getConfig(key: EnvKeys) {
  return env(key);
}

export const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT as string;

export function getImagePath(bucketPath: string) {
  const url = new URL(getConfig('CDN'));
  url.pathname = url.pathname ? (url.pathname + '/' + bucketPath).replaceAll('//', '/') : bucketPath;

  return url.toString();
}

export const BRAND_NAME = 'ts-starter-graphql';
