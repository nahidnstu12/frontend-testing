import { API_ROUTES } from '../apiRoutes';
import { baseApi } from './baseApi';
import type { User } from '@/types/shared';

interface UserResponse {
  user: User;
}

interface UsersResponse {
  users: User[];
}

interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role?: string;
}

interface UpdateUserRequest {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UsersResponse, void>({
      query: () => ({
        url: API_ROUTES.USERS,
        method: 'GET',
      }),
      providesTags: ['User'],
    }),
    getUser: builder.query<UserResponse, string>({
      query: (name) => ({
        url: `${API_ROUTES.USERS}/${name}`,
        method: 'GET',
      }),
      providesTags: (result, error, name) => [{ type: 'User', id: name }],
    }),
    createUserByAdmin: builder.mutation<UserResponse, CreateUserRequest>({
      query: (data) => ({
        url: API_ROUTES.USERS,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
    updateUserByAdmin: builder.mutation<UserResponse, { name: string; data: UpdateUserRequest }>({
      query: ({ name, data }) => ({
        url: `${API_ROUTES.USERS}/${name}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { name }) => [
        { type: 'User', id: name },
        'User',
      ],
    }),
    updateUser: builder.mutation<UserResponse, { name: string; data: UpdateUserRequest }>({
      query: ({ name, data }) => ({
        url: `${API_ROUTES.USERS}/${name}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { name }) => [
        { type: 'User', id: name },
        'User',
      ],
    }),
    deleteUserByAdmin: builder.mutation<void, string>({
      query: (name) => ({
        url: `${API_ROUTES.USERS_ADMIN}/${name}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useCreateUserByAdminMutation,
  useUpdateUserByAdminMutation,
  useDeleteUserByAdminMutation,
} = userApi;
