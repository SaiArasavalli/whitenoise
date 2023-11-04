import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from 'src/app/firebase';
import { Menu } from 'src/app/interfaces/menu';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css'],
})
export class MenuListComponent {
  menu: Menu[] = [];
  filteredMenu: Menu[] = [];

  searchForm = this.fb.group({
    name: [''],
  });

  constructor(private fb: FormBuilder) {
    this.searchForm.get('name')?.valueChanges.subscribe((name) => {
      if (name) {
        this.filteredMenu = this.menu.filter((item) => {
          return item.name.toLowerCase().includes(name.trim().toLowerCase());
        });
      } else {
        this.filteredMenu = this.menu;
      }
    });
  }

  ngOnInit() {
    const q = query(collection(db, 'menu'), orderBy('created', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      this.menu = [];
      querySnapshot.forEach((doc) => {
        this.menu.push({ id: doc.id, ...doc.data() } as Menu);
      });
      this.filteredMenu = this.menu;
    });
  }
}
