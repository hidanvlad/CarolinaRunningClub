export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
export const GRAPHQL_URL = `${API_URL}/graphql`;
export const WS_URL = import.meta.env.VITE_WS_URL || API_URL;

export const DEFAULT_PAGE_SIZE = 7;
