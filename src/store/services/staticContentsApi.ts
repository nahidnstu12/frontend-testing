import { API_ROUTES } from '../apiRoutes';
import { baseApi } from './baseApi';

export interface StaticContent {
  id: number;
  title: string;
  body: string;
  code: string;
  status: string;
  organization_id: number;
  created_at?: string;
  updated_at?: string;
}

export interface PaginationMeta {
  total_records: number;
  page_size: number;
  current_page: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface StaticContentQueryParams {
  page?: number;
  page_size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  organization_id?: number;
}

export interface CreateStaticContentRequest {
  title: string;
  body: string;
  code: string;
  status: string;
  organization_id: number;
}

export interface UpdateStaticContentRequest {
  title?: string;
  body?: string;
  status?: string;
  organization_id?: number;
}

export const staticContentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStaticContents: builder.query<PaginatedResponse<StaticContent>, StaticContentQueryParams>({
      query: (params) => {
        const searchParams = new URLSearchParams();
        
        if (params.page) searchParams.append('page', params.page.toString());
        if (params.page_size) searchParams.append('page_size', params.page_size.toString());
        if (params.sort) searchParams.append('sort', params.sort);
        if (params.order) searchParams.append('order', params.order);
        if (params.search) searchParams.append('search', params.search);
        if (params.status) searchParams.append('status', params.status);
        if (params.organization_id) searchParams.append('organization_id', params.organization_id.toString());
        
        const queryString = searchParams.toString();
        console.log("queryString>>", queryString, params);
        return `${API_ROUTES.STATIC_CONTENTS}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: ['Static_Content'],
    }),
    
    getStaticContent: builder.query<StaticContent, number>({
      query: (id) => `${API_ROUTES.STATIC_CONTENTS}/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Static_Content', id }],
    }),
    
    createStaticContent: builder.mutation<StaticContent, CreateStaticContentRequest>({
      query: (body) => {
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', body.title);
        formData.append('body', body.body);
        
        formData.append('status', body.status);
        formData.append('organization_id', body.organization_id.toString());
        
       
        return {
          url: API_ROUTES.STATIC_CONTENTS,
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: ['Static_Content'],
    }),
    
      updateStaticContent: builder.mutation<StaticContent, { id: number; body: UpdateStaticContentRequest }>({
      query: ({ id, body }) => {
        const formData = new FormData();
        
        // Add text fields
        if (body.title) formData.append('title', body.title);
        if (body.body) formData.append('body', body.body);
       if (body.status) formData.append('status', body.status);
        if (body.organization_id) formData.append('organization_id', body.organization_id.toString());
        
       
        
        return {
          url: `${API_ROUTES.STATIC_CONTENTS}/${id}`,
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Static_Content', id }],
    }),
    
    deleteStaticContent: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.STATIC_CONTENTS}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Static_Content'],
    }),
  }),
});

export const {
  useGetStaticContentsQuery,
  useGetStaticContentQuery,
  useCreateStaticContentMutation,
  useUpdateStaticContentMutation,
  useDeleteStaticContentMutation,
} = staticContentApi; 