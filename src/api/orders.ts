import type { IOrder } from '@/models';
import { type AxiosResponse } from 'axios';
import { useMutation, useQuery, useQueryClient } from 'vue-query';
import api from './config';

const ORDERS_KEY = "orders"
const ORDER_KEY = "order"

export const useGetOrders = (userId: number) => {
  return useQuery(
    ORDERS_KEY,
    () => api.get(`/${ORDERS_KEY}/${userId}`),
    {
      select: (result: AxiosResponse) => {
        return result.data;
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
}

// I don't cache order to refetch everytime time that we to this query
export const useGetOrderById = (orderId: number) => {
  return useQuery(
    ORDER_KEY,
    () => api.get(`/${ORDER_KEY}/${orderId}`),
    {
      select: (result: AxiosResponse) => {
        return result.data;
      },
    }
  );
}

export const useAddOrder = () => {
  const queryClient = useQueryClient();

  return useMutation(() => api.post(`/${ORDERS_KEY}`,
    { user: 1, orderDate: new Date().toISOString(), product: "consola" }
  ),
    {
      onSuccess: (result) => {
        queryClient.setQueryData(ORDERS_KEY, (old: any) => {
          const _old = { ...old };

          // The orders API are not getting and returning the orders always with the same model. 
          // Because of that I need to do this conversion here to achive my model

          const newOrder: IOrder = {
            created_at: result.data.createdAt,
            id: result.data.id,
            order_date: result.data.orderDate,
            product: result.data.product,
            updated_at: result.data.updatedAt,
            user_id: result.data.userId,
          }

          _old.data = [...old.data, newOrder]
          return _old;
        });
      },
    });
}

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation((orderId: number) => api.put(`/${ORDER_KEY}/${orderId}/edit`,
    { orderDate: new Date().toISOString(), product: "1" }
  ),
    {
      onSuccess: (result) => {
        queryClient.setQueryData(ORDERS_KEY, (old: any) => {
          const _old = { ...old };
          const oldOrders = _old.data;
          const newOrder = result.data;
          const objIndex = oldOrders.findIndex((item: IOrder) => item.id === newOrder.id);

          if (objIndex === -1) {
            return;
          }

          // I need to do this because the modals are diferent
          const updatedObj = {
            ...oldOrders[objIndex],
            order_date: newOrder.orderDate,
            product: newOrder.product,
            updated_at: newOrder.updatedAt,
          };

          console.log(updatedObj, newOrder)

          _old.data = [
            ...oldOrders.slice(0, objIndex),
            updatedObj,
            ...oldOrders.slice(objIndex + 1),
          ];

          return _old;
        });
      },
    });
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation((orderId: number) => api.delete(`/${ORDERS_KEY}/${orderId}`),
    {
      onSuccess: (result, orderId) => {
        queryClient.setQueryData(ORDERS_KEY, (old: any) => {
          const _old = { ...old };
          _old.data = old.data.filter((item: IOrder) => item.id !== orderId)
          return _old
        });
      },
    });
}
