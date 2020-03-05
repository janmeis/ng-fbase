import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Item } from '../item-detail/item';

export interface ItemWithRef extends Item {
  refId: string;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  items: Observable<ItemWithRef[]>;
  refId: string[];

  constructor(
    private db: AngularFirestore,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.items = this.db.collection<Item>('/Items').valueChanges().pipe(
      flatMap(_ => this.db.collection<Item>('/Items').get()),
      map(querySnapshot => querySnapshot.docs),
      map(docs => docs.map(doc => this.getItemWithRef(doc)))
    );
  }

  itemDetail(id: string) {
    this.router.navigate(['/item-detail', id]);
  }

  removeItem(id: string) {
    this.db.collection<Item>('/Items').doc(id).delete();
  }

  private getItemWithRef = (doc: firestore.QueryDocumentSnapshot<firestore.DocumentData>): ItemWithRef =>
    Object.assign({ refId: doc.id } as ItemWithRef, doc.data())
}
