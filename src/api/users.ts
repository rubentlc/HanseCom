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
export const useGetUserById = (userId: number) => {
  return useQuery(
    USER_KEY,
    () => api.get(`/${USER_KEY}/${userId}`),
    {
      select: (result: AxiosResponse) => {
        return result.data;
      }
    }
  );
}

export const useAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation(() => api.post(`/${USERS_KEY}`,
    { fullName: "Ruben", email: "eu13@gmail.com", password: "123" }
  ),
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

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation((userId: number) => api.put(`/${USER_KEY}/${userId}/edit`,
    { fullName: "NEW NAME", email: "new@gmail.com" }
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

          // const updatedObj = {
          //   ...oldUsers[objIndex],
          //   order_date: newUser.orderDate,
          //   product: newUser.product,
          //   updated_at: newUser.updatedAt,
          // };

          

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


