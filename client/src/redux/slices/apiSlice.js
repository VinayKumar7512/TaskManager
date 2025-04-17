import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Use port 5001 to match the backend server
const API_URI = 'http://localhost:5001';
const baseQuery = fetchBaseQuery({ 
  baseUrl: `${API_URI}/api`,
  credentials: 'include',
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    return headers;
  }
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: [],
  endpoints: (builder) => ({}),
});