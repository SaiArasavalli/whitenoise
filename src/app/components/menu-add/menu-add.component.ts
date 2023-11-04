import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Menu } from 'src/app/interfaces/menu';

@Component({
  selector: 'app-menu-add',
  templateUrl: './menu-add.component.html',
  styleUrls: ['./menu-add.component.css'],
})
export class MenuAddComponent {
  submitting: boolean = false;
  menuForm = this.fb.group({
    name: ['', [Validators.required]],
    price: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private location: Location) {}

  async onSubmit() {
    if (this.menuForm.valid) {
      this.submitting = true;
      const menuData = this.menuForm.value;
      await addDoc(collection(db, 'menu'), {
        name: menuData.name,
        price: Number(menuData.price),
        created: serverTimestamp(),
      });
      this.menuForm.reset();
      this.submitting = false;
      this.location.back();
    }
  }
}
