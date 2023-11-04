import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Customer } from 'src/app/interfaces/customer';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];

  searchForm = this.fb.group({
    name: [''],
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.get('name')?.valueChanges.subscribe((name) => {
      if (name) {
        this.filteredCustomers = this.customers.filter((customer) => {
          return customer.name
            .toLowerCase()
            .startsWith(name.trim().toLowerCase());
        });
      } else {
        this.filteredCustomers = this.customers;
      }
    });
  }

  ngOnInit() {
    const q = query(collection(db, 'customers'), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.customers = [];
      querySnapshot.forEach((doc) => {
        this.customers.push({ id: doc.id, ...doc.data() } as Customer);
      });
      this.filteredCustomers = this.customers;
    });
  }
}
