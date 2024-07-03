import {baseApi} from '../BaseApiSlice';
import {UserDetailsResponse} from './types';

// Define a service using a base URL and expected endpoints
export const userDetailsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserDetails: builder.query<UserDetailsResponse, string>({
      query: (userId: string) => ({
        url: `api/GetUserProfile?id=${userId}`,
        method: 'GET',
        
      }),
     
    }),
  }),
});

export const {useGetUserDetailsQuery, useLazyGetUserDetailsQuery} =
  userDetailsApi;




