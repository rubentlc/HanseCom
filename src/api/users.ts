import type { IUser } from '@/models';
import { type AxiosResponse } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'vue-query';
import api from './config';

const USERS_KEY = 'users'
const USER_KEY = 'user'

export const useGetUsers = () => {
  return useQuery(
    USERS_KEY,
    () => api.get(`/${USERS_KEY}`),
    {
      select: (result: AxiosResponse) => result.data,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}

// I don't cache user to refetch everytime time that we to this query
export const useGetUserById = (userId: number | null | undefined) => {
  return useQuery(
    [USER_KEY, userId],
    () => api.get(`/${USER_KEY}/${userId}`),
    {
      enabled: Boolean(userId),
      select: (result: AxiosResponse) => {
        return {
          id: result.data.id,
          fullName: result.data.full_name,
          email: result.data.email
        };
      }
    },
  );
}

interface IAddUserProp {
  fullName: string;
  email: string;
  password: string;
}

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation((user: IAddUserProp) => api.post(`/${USERS_KEY}`, user),
    {
      onSuccess: (result) => {
        // I didn't get a way to type the old prop so I pus as any
        queryClient.setQueryData(USERS_KEY, (old: any) => {
          const _old = { ...old };
          _old.data = [...old.data, result.data]
          return _old;
        });
      },
    });
}

interface IUpdateUserProp {
  id: string;
  fullName: string;
  email: string;
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation((user: IUpdateUserProp) => api.put(`/${USER_KEY}/${user.id}/edit`,
    { fullName: user.fullName, email: user.email }
  ),
    {
      onSuccess: (result) => {
        queryClient.setQueryData(USERS_KEY, (old: any) => {
          const _old = { ...old };
          const oldUsers = _old.data;
          const newUser = result.data;
          const objIndex = oldUsers.findIndex((item: IUser) => item.id === newUser.id);

          if (objIndex === -1) {
            return;
          }          

          _old.data = [
            ...oldUsers.slice(0, objIndex),
            newUser,
            ...oldUsers.slice(objIndex + 1),
          ];

          return _old;
        });
      },
    });
}

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation((userId: number) => api.delete(`/${USERS_KEY}/${userId}`),
    {
      onSuccess: (result, userId) => {
        queryClient.setQueryData(USERS_KEY, (old: any) => {
          const _old = { ...old };
          _old.data = old.data.filter((item: IUser) => item.id !== userId)
          return _old
        });
      },
    });
}


