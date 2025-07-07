import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { TAGS_KEY } from '../apiRoutes';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1/',
    credentials: 'include',
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      const token = Cookies.get('token');
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [TAGS_KEY.USER, TAGS_KEY.NOTICE, TAGS_KEY.ORGANIZATION, TAGS_KEY.SLIDER, TAGS_KEY.STATIC_CONTENT],
  endpoints: () => ({}),
});
