import { apiHost } from '@/src/constants.js';

export const endpoint = (path) => {
  return `${apiHost}${path}`;
}
