import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { from, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CanComponentDeactivate } from '../guard/can-deactivate.guard';
import { DialogService } from '../services/dialog.service';
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
export class ItemDetailComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  validateForm: FormGroup;
  id: string;

  /// <see cref="https://stackblitz.com/edit/angular-reactive-forms-validation"/>
  // convenience getter for easy access to form fields
  get f() { return this.validateForm.controls; }

  constructor(
    private db: AngularFirestore,
    private route: ActivatedRoute,
    private dialogService: DialogService,
    private fb: FormBuilder,
    private router: Router
  ) { }

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

  ngOnDestroy(): void {
  }

  onSubmit() {
    this.save().pipe(
      untilDestroyed(this)
    ).subscribe(saved => {
      if (saved) {
        this.validateForm.markAsPristine();   // for canDeactivate guard
        this.router.navigate(['/item-list']);
      }
    });
  }

  canDeactivate(): Observable<boolean> {
    if (this.validateForm.dirty)
      return this.dialogService.dirtyConfirmation(() => this.save());

    return of(true);
  }

  private save(): Observable<boolean> {
    markControlsDirty(this.validateForm);
    if (this.validateForm.invalid)
      return of(false);

    const item = this.validateForm.value as Item;
    if (this.id != 'new')
      return from(this.db.collection<Item>('/Items').doc(this.id).set(item, { merge: true })).pipe(
        map(_ => true),
        catchError(err => {
          console.log(err);
          return of(false);
        })
      );
    else
      return from(this.db.collection<Item>('/Items').add(item)).pipe(
        map(ref => {
          console.log(ref);
          return true;
        }),
        catchError(err => {
          console.log(err);
          return of(false);
        })
      );
  }
}
