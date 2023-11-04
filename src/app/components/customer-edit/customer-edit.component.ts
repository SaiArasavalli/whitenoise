import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';
import { Game } from 'src/app/interfaces/game';

@Component({
  selector: 'app-customer-edit',
  templateUrl: './customer-edit.component.html',
  styleUrls: ['./customer-edit.component.css'],
})
export class CustomerEditComponent {
  customerId!: string;
  submitting: boolean = false;
  customerForm = this.fb.group({
    name: ['', [Validators.required]],
    phone: ['', [Validators.maxLength(10)]],
    sub: [false, Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.customerId = String(this.route.snapshot.paramMap.get('customerId'));
    const docRef = doc(db, 'customers', this.customerId);
    const docSnap = await getDoc(docRef);
    const customerData = docSnap.data() as Customer;
    this.customerForm.patchValue(customerData);
  }

  async onSubmit() {
    if (this.customerForm.valid) {
      this.submitting = true;
      const updatedCustomerData = this.customerForm.value;
      const customerId = this.customerId;
      const customerDocRef = doc(db, 'customers', customerId);
      await updateDoc(customerDocRef, {
        name: updatedCustomerData.name,
        phone: updatedCustomerData.phone,
        sub: updatedCustomerData.sub,
      });
      this.router.navigate(['/customers']);
      this.submitting = false;
    }
  }
}
