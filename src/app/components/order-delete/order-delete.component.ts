import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Order } from 'src/app/interfaces/order';

@Component({
  selector: 'app-order-delete',
  templateUrl: './order-delete.component.html',
  styleUrls: ['./order-delete.component.css'],
})
export class OrderDeleteComponent {
  orderId!: string;
  submitting: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}
  async onSubmit() {
    this.orderId = String(this.route.snapshot.paramMap.get('orderId'));
    const orderDocRef = doc(db, 'orders', this.orderId);
    await deleteDoc(orderDocRef);
    this.location.back();
    this.submitting = false;
  }

  goBack() {
    this.location.back();
  }
}
