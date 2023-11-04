import { Component, Input } from '@angular/core';
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
  selector: 'app-home-order-list',
  templateUrl: './home-order-list.component.html',
  styleUrls: ['./home-order-list.component.css'],
})
export class HomeOrderListComponent {
  orders: Order[] = [];
  menu: Menu[] = [];
  filteredOrders: Order[] = [];
  @Input() isAdmin!: boolean;
  loadingOrders: boolean = true;
  loadingMenu: boolean = true;

  searchForm = this.fb.group({
    name: [''],
    payment: [''],
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.valueChanges.subscribe((formValues) => {
      const name = formValues.name;
      const payment = formValues.payment;

      if (name || payment) {
        this.filteredOrders = this.orders.filter(
          (order) =>
            order.customer
              .toLowerCase()
              .includes(name?.trim().toLowerCase() || '') &&
            order.payment
              .toLowerCase()
              .includes(payment?.trim().toLowerCase() || '')
        );
      } else {
        this.filteredOrders = this.orders;
      }
    });
  }

  ngOnInit() {
    const today = new Date();

    // Get the start and end timestamps for today
    const startOfToday = Timestamp.fromDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        0,
        0,
        0,
        0
      )
    );
    const endOfToday = Timestamp.fromDate(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        23,
        59,
        59,
        999
      )
    );
    const q = query(
      collection(db, 'orders'),
      orderBy('created', 'desc'),
      where('created', '>=', startOfToday),
      where('created', '<=', endOfToday)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.orders = [];
      querySnapshot.forEach((doc) => {
        this.orders.push({ id: doc.id, ...doc.data() } as Order);
      });
      this.filteredOrders = this.orders;
      this.loadingOrders = false;
    });

    const q2 = query(collection(db, 'menu'), orderBy('name'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.menu = [];
      querySnapshot.forEach((doc) => {
        this.menu.push({ id: doc.id, ...doc.data() } as Menu);
      });
      this.loadingMenu = false;
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
