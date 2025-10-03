// Re-export all API endpoints from a single module for easier imports
//import like this: import { rootApi } from '@nndm/api/client';
//then use like this: rootApi.getRoot() or other endpoints
//this is similiar to router behaviour

export { API_CONFIG } from "./config";
export { rootApi } from "./endpoints/root";
// Re-export useful types and utilities
export { ApiError } from "./fetch";
