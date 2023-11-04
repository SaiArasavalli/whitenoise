import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Board } from 'src/app/interfaces/board';
import { Menu } from 'src/app/interfaces/menu';

@Component({
  selector: 'app-menu-edit',
  templateUrl: './menu-edit.component.html',
  styleUrls: ['./menu-edit.component.css'],
})
export class MenuEditComponent {
  itemId!: string;
  submitting: boolean = false;
  menuForm = this.fb.group({
    name: ['', [Validators.required]],
    price: [0, [Validators.maxLength(10)]],
  });

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private location: Location
  ) {}

  async ngOnInit() {
    this.itemId = String(this.route.snapshot.paramMap.get('itemId'));
    const docRef = doc(db, 'menu', this.itemId);
    const docSnap = await getDoc(docRef);
    const menuData = docSnap.data() as Menu;
    this.menuForm.patchValue(menuData);
  }

  async onSubmit() {
    if (this.menuForm.valid) {
      this.submitting = true;
      const updatedMenuData = this.menuForm.value;
      const itemId = this.itemId;
      const menuDocRef = doc(db, 'menu', itemId);
      await updateDoc(menuDocRef, {
        name: updatedMenuData.name,
        price: updatedMenuData.price,
      });
      this.location.back();
      this.submitting = false;
    }
  }
}
