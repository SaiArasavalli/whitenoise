import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  onSnapshot,
  updateDoc,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Menu } from 'src/app/interfaces/menu';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.css'],
})
export class OrderEditComponent {
  menu: Menu[] = [];
  orderId!: string;
  customers: Customer[] = [];
  orderForm = this.fb.group({
    customer: ['', Validators.required],
    items: this.fb.array([], Validators.required),
    payment: ['', Validators.required],
    comment: [''],
  });
  submitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  async ngOnInit() {
    this.orderId = String(this.route.snapshot.paramMap.get('orderId'));
    const docRef = doc(db, 'orders', this.orderId);
    const docSnap = await getDoc(docRef);
    const order = docSnap.data() as Order;
    const orderData = {
      customer: order.customer,
      items: order.items,
      payment: order.payment,
      comment: order.comment,
    };
    this.orderForm.patchValue(orderData);
    this.setFormItems(orderData['items']);

    // Fetch menu items from the database
    const q2 = query(collection(db, 'menu'), orderBy('name'));
    const unsubscribe2 = onSnapshot(q2, (querySnapshot) => {
      this.menu = [];
      querySnapshot.forEach((doc) => {
        this.menu.push({ id: doc.id, ...doc.data() } as Menu);
      });
    });

    const q = query(collection(db, 'customers'), orderBy('name'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
    });
  }

  get items() {
    return this.orderForm.get('items') as FormArray;
  }

  setFormItems(items: any[]) {
    items.forEach((item) => {
      this.items.push(this.fb.group(item));
    });
  }

  addItems() {
    this.items.push(this.fb.group({ name: [''], quantity: [0] }));
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

  async onSubmit() {
    if (this.orderForm.valid) {
      this.submitting = true;
      const orderId = this.orderId;
      const orderData = this.orderForm.value;
      const totalAmount = this.calculateTotalAmount();
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        customer: orderData.customer,
        items: orderData.items,
        totalAmount: totalAmount,
        payment: orderData.payment,
        comment: orderData.comment,
      });
      this.submitting = false;
      this.location.back();
    }
  }

  removeItem(index: number) {
    this.items.removeAt(index);
    this.calculateTotalAmount();
  }
}
