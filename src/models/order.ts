
// export interface IOrder {
//   id?: string,
//   userId: string,
//   orderDate: Date,
//   product: string
// }

// the orders API are not getting and returning the orders like descripted in README. 
// Because of that I need to do this conversion here to achive my model
export interface IOrder {
  created_at: string,
  id: number
  order_date: string;
  product: string
  updated_at: string
  user_id: number
}