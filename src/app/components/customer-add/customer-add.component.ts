import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';

@Component({
  selector: 'app-customer-add',
  templateUrl: './customer-add.component.html',
  styleUrls: ['./customer-add.component.css'],
})
export class CustomerAddComponent {
  submitting: boolean = false;
  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.maxLength(10)]],
    sub: [false, [Validators.required]],
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  async onSubmit() {
    if (this.customerForm.valid) {
      this.submitting = true;
      const customerData = this.customerForm.value;
      await addDoc(collection(db, 'customers'), {
        name: customerData.name?.replace(/^[a-z]/, (match) =>
          match.toUpperCase()
        ),
        phone: customerData.phone,
        sub: customerData.sub,
        created: serverTimestamp(),
      });
      this.customerForm.reset();
      this.submitting = false;
      this.router.navigate(['/']);
    }
  }
}
