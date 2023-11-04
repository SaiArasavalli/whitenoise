import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Menu } from 'src/app/interfaces/menu';

@Component({
  selector: 'app-menu-delete',
  templateUrl: './menu-delete.component.html',
  styleUrls: ['./menu-delete.component.css'],
})
export class MenuDeleteComponent {
  itemId!: string;
  submitting: boolean = false;

  constructor(private route: ActivatedRoute, private location: Location) {}

  async onSubmit() {
    this.submitting = true;
    this.itemId = String(this.route.snapshot.paramMap.get('itemId'));
    const itemId = this.itemId;
    const menuDocRef = doc(db, 'menu', itemId);
    await deleteDoc(menuDocRef);
    this.location.back();
  }

  goBack() {
    this.location.back();
  }
}
