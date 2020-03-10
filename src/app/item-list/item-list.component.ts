import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Item } from '../item-detail/item';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

export interface ItemWithRef extends Item {
  refId: string;
}

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss']
})
export class ItemListComponent implements OnInit {
  closeResult: string;
  items: Observable<ItemWithRef[]>;
  refId: string[];

  constructor(
    private db: AngularFirestore,
    private modalService: NgbModal,
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

  openVerticallyCentered(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
  }

  private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}

  private getItemWithRef = (doc: firestore.QueryDocumentSnapshot<firestore.DocumentData>): ItemWithRef =>
    Object.assign({ refId: doc.id } as ItemWithRef, doc.data())
}
