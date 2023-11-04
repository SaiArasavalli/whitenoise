import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  Timestamp,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Order } from 'src/app/interfaces/order';
import { Menu } from 'src/app/interfaces/menu';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-order-add',
  templateUrl: './order-add.component.html',
  styleUrls: ['./order-add.component.css'],
})
export class OrderAddComponent {
  customers: Customer[] = [];
  submitting: boolean = false;
  menu: Menu[] = [];
  orderForm = this.fb.group({
    customer: ['', [Validators.required]],
    items: this.fb.array([], Validators.required),
    payment: ['', [Validators.required]],
    comment: [''],
    created: [''],
  });

  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.maxLength(10)]],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
    });

    const q2 = query(collection(db, 'menu'), orderBy('name'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.menu = [];
      querySnapshot.forEach((doc) => {
        this.menu.push({ id: doc.id, ...doc.data() } as Menu);
      });
    });
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  addItems() {
    this.items.push(this.fb.group({ name: [''], quantity: [1] }));
    this.calculateTotalAmount();
  }

  calculateTotalAmount() {
    let sum = 0;
    if (this.items.value.length !== 0) {
      this.items.value.forEach((item: { name: string; quantity: number }) => {
        const newItem = this.menu.find((itemObj) => itemObj.name === item.name);
        if (newItem) {
          sum += newItem.price * item.quantity;
        }
      });
    }
    return sum;
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotalAmount();
  }

  async onSubmit() {
    if (this.orderForm.valid) {
      this.submitting = true;
      const orderData = this.orderForm.value;
      const totalAmount = this.calculateTotalAmount();
      await addDoc(collection(db, 'orders'), {
        customer: orderData.customer,
        items: orderData.items,
        totalAmount: totalAmount,
        payment: orderData.payment,
        comment: orderData.comment,
        created: Timestamp.fromDate(new Date(orderData.created!)),
      });
      this.submitting = false;
      this.location.back();

      this.orderForm = this.fb.group({
        customer: ['', [Validators.required]],
        items: this.fb.array([], Validators.required),
        payment: ['', [Validators.required]],
        comment: [''],
        created: [''],
      });
    }
  }
}
