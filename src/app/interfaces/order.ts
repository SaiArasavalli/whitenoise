import { Timestamp } from 'firebase/firestore';

export interface Order {
  id: string;
  customer: string;
  items: { name: string; quantity: number }[];
  totalAmount: number;
  payment: string;
  comment?: string;
  created: Timestamp;
}
