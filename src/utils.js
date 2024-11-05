import { apiHost } from './constants.js';

export const endpoint = (path) => {
  return `${apiHost}${path}`;
}
