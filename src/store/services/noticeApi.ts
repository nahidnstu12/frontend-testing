import { API_ROUTES, TAGS_KEY } from '../apiRoutes';
import { baseApi } from './baseApi';

export interface Notice {
  id: number;
  title: string;
  body: string;
  publish_date: string;
  archive_date: string;
  cover_image: string;
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

export interface NoticeQueryParams {
  page?: number;
  page_size?: number;
  sort?: string;
  order?: 'asc' | 'desc';
  search?: string;
  status?: string;
  organization_id?: number;
}

export interface CreateNoticeRequest {
  title: string;
  body: string;
  publish_date: string;
  archive_date: string;
  cover_image?: File;
  status: string;
  organization_id: number;
}

export interface UpdateNoticeRequest {
  title?: string;
  body?: string;
  publish_date?: string;
  archive_date?: string;
  cover_image?: File;
  status?: string;
  organization_id?: number;
}

export const noticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query<PaginatedResponse<Notice>, NoticeQueryParams>({
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
        return `${API_ROUTES.NOTICES}${queryString ? `?${queryString}` : ''}`;
      },
      providesTags: [TAGS_KEY.NOTICE],
    }),
    
    getNotice: builder.query<Notice, number>({
      query: (id) => `${API_ROUTES.NOTICES}/${id}`,
      providesTags: (_result, _error, id) => [{ type: TAGS_KEY.NOTICE, id }],
    }),
    
    createNotice: builder.mutation<Notice, CreateNoticeRequest>({
      query: (body) => {
        const formData = new FormData();
        
        // Add text fields
        formData.append('title', body.title);
        formData.append('body', body.body);
        formData.append('publish_date', body.publish_date);
        formData.append('archive_date', body.archive_date);
        formData.append('status', body.status);
        formData.append('organization_id', body.organization_id.toString());
        
        // Add file if present
        if (body.cover_image) {
          formData.append('cover_image', body.cover_image);
        }
        
        return {
          url: API_ROUTES.NOTICES,
          method: 'POST',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: [TAGS_KEY.NOTICE],
    }),
    
    updateNotice: builder.mutation<Notice, { id: number; body: UpdateNoticeRequest }>({
      query: ({ id, body }) => {
        const formData = new FormData();
        
        // Add text fields
        if (body.title) formData.append('title', body.title);
        if (body.body) formData.append('body', body.body);
        if (body.publish_date) formData.append('publish_date', body.publish_date);
        if (body.archive_date) formData.append('archive_date', body.archive_date);
        if (body.status) formData.append('status', body.status);
        if (body.organization_id) formData.append('organization_id', body.organization_id.toString());
        
        // Add file if present
        if (body.cover_image) {
          formData.append('cover_image', body.cover_image);
        }
        
        return {
          url: `${API_ROUTES.NOTICES}/${id}`,
          method: 'PUT',
          body: formData,
          // Don't set Content-Type header, let browser set it with boundary
          prepareHeaders: (headers: Headers) => {
            headers.delete('Content-Type');
            return headers;
          },
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: TAGS_KEY.NOTICE, id }],
    }),
    
    deleteNotice: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ROUTES.NOTICES}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [TAGS_KEY.NOTICE],
    }),
  }),
});

export const {
  useGetNoticesQuery,
  useGetNoticeQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation,
} = noticeApi; 