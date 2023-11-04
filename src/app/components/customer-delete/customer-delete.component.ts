import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';

@Component({
  selector: 'app-customer-delete',
  templateUrl: './customer-delete.component.html',
  styleUrls: ['./customer-delete.component.css'],
})
export class CustomerDeleteComponent {
  customerId!: string;
  submitting: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  async onSubmit() {
    this.submitting = true;
    this.customerId = String(this.route.snapshot.paramMap.get('customerId'));
    const customerDocRef = doc(db, 'customers', this.customerId);
    await deleteDoc(customerDocRef);
    this.router.navigate(['/customers']);
    this.submitting = false;
  }

  goBack() {
    this.location.back();
  }
}
