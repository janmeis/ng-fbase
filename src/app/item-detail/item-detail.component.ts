import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Item } from './item';

/// <see cref="https://stackoverflow.com/a/50992362"></see>
export function markControlsDirty(group: FormGroup | FormArray): void {
  Object.keys(group.controls).forEach((key: string) => {
    const abstractControl = group.controls[key];

    if (abstractControl instanceof FormGroup || abstractControl instanceof FormArray)
      markControlsDirty(abstractControl);
    else
      abstractControl.markAsDirty();
  });
}

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss']
})
export class ItemDetailComponent implements OnInit {
  validateForm: FormGroup;
  id: string;

  /// <see cref="https://stackblitz.com/edit/angular-reactive-forms-validation"/>
  // convenience getter for easy access to form fields
  get f() { return this.validateForm.controls; }

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
    markControlsDirty(this.validateForm);
    if (this.validateForm.invalid)
      return;

    const item = this.validateForm.value as Item;
    if (this.id != 'new')
      this.db.collection<Item>('/Items').doc(this.id).set(item, { merge: true });
    else
      this.db.collection<Item>('/Items').add(item);

    this.router.navigate(['/item-list']);
  }
}
