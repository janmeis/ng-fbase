import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item } from './item';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  validateForm: FormGroup;
  id: string;

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');

    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      value: [null, [Validators.required]],
      comment: [null]
    });

    if (this.id != 'new')
      this.db.collection<Item>('/Items').doc(this.id).get().subscribe(item => {
        const data = item.data();
        this.validateForm.patchValue(data);
      });
  }

  onSubmit() {
    const item = this.validateForm.value as Item;
    if (this.id != 'new')
      this.db.collection<Item>('/Items').doc(this.id).set(item, { merge: true });
    else
      this.db.collection<Item>('/Items').add(item);

    this.router.navigate(['/item-list']);
  }

}
