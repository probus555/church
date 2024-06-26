import {API_TOKEN, REACT_APP_BASE_URL} from '@env';
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
console.log('REACT_APP_BASE_URL', REACT_APP_BASE_URL);
export const baseApi = createApi({
  reducerPath: 'baseApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${REACT_APP_BASE_URL}`,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`,
    },
  }),
  tagTypes: [
    'Post',
    'SL',
    'PunchMissingList',
    'Leave',
    'event',
    'news',
    'notification',
  ],
  endpoints: () => ({}),
});

// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// export const baseApi = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: 'http://97.74.95.178:8080/' }),
//   endpoints: () => ({}),
// });
