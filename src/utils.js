import { apiHost } from './constants';

export const endpoint = (path) => {
  return `${apiHost}${path}`;
};

// https://chatgpt.com/share/6743af5d-f2d0-8008-9883-0852c7a26e85
export const camelToHuman = (s) => {
  return s
    .replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before capital letters
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2') // Handle cases like "HTMLParser" to "HTML Parser"
    .replace(/./g, (str) => str.toLowerCase())
    .replace(/url|css/, (str) => str.toUpperCase())
    .replace(/^./, (str) => str.toUpperCase());
};

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
