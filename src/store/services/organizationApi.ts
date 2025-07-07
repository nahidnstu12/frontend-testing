import { API_ROUTES } from "../apiRoutes";
import { baseApi } from "./baseApi";


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
  
  export interface OrganizationQueryParams {
    page?: number;
    page_size?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
    status?: string;
  }

export const organizationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getOrganizationList: builder.query<PaginatedResponse<any>, OrganizationQueryParams>({
        query: (params) => {
          const searchParams = new URLSearchParams();
          
          if (params.page) searchParams.append('page', params.page.toString());
          if (params.page_size) searchParams.append('page_size', params.page_size.toString());
          if (params.sort) searchParams.append('sort', params.sort);
          if (params.order) searchParams.append('order', params.order);
          if (params.search) searchParams.append('search', params.search);
          if (params.status) searchParams.append('status', params.status);
          
          const queryString = searchParams.toString();
          return `${API_ROUTES.ORGANIZATIONS}${queryString ? `?${queryString}` : ''}`;
        },
        providesTags: ['Organization'],
      }),
      
      getOrganizations: builder.query<any, void>({
        query: () => API_ROUTES.ORGANIZATIONS,
        providesTags: ['Organization'],
      }),
      getOrganization: builder.query<any, number>({
        query: (id) => `${API_ROUTES.ORGANIZATIONS}/${id}`,
        providesTags: (_result, _error, id) => [{ type: 'Organization', id }],
      }),
      
      
    }),
  });
  
  export const {
    useGetOrganizationListQuery,
    useGetOrganizationQuery,
    useGetOrganizationsQuery,
  } = organizationApi; 