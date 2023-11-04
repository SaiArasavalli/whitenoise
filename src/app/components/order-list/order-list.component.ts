import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  query,
  collection,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Menu } from 'src/app/interfaces/menu';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent {
  orders: Order[] = [];
  menu: Menu[] = [];
  filteredOrders: Order[] = [];

  searchForm = this.fb.group({
    name: [''],
    startDate: [''],
    endDate: [''],
    payment: [''],
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.valueChanges.subscribe((formValues) => {
      const name = formValues.name;
      const startDate = formValues.startDate;
      const endDate = formValues.endDate;
      const payment = formValues.payment;

      if (name || (startDate && endDate) || payment) {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.customer
              .toLowerCase()
              .includes(name?.trim().toLowerCase() || '') &&
            order.payment
              .toLowerCase()
              .includes(payment?.trim().toLowerCase() || '') &&
            (startDate && endDate
              ? new Date(order.created.toDate()) >= new Date(startDate) &&
                new Date(order.created.toDate()) <= new Date(endDate)
              : false)
        );
      } else {
        this.filteredOrders = this.orders;
      }
    });
  }

  ngOnInit() {
    const q = query(collection(db, 'orders'), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.orders = [];
      querySnapshot.forEach((doc) => {
        this.orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      this.filteredOrders = this.orders;
    });

    const q2 = query(collection(db, 'menu'), orderBy('name'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.menu = [];
      querySnapshot.forEach((doc) => {
        this.menu.push({ id: doc.id, ...doc.data() } as Menu);
      });
    });
  }

  calculatePrice(item: { name: string; quantity: number }) {
    const newItem = this.menu.find((x) => x.name === item.name);
    if (newItem) {
      return newItem.price;
    }
    return 0;
  }
}
