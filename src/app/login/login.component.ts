import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../services/authentication-service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  error: string;
  validateForm: FormGroup;
  returnUrl: string | null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || null;
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
  }

  logIn(): Promise<any> {
    if (this.validateForm.invalid)
      return;

    const email = this.validateForm.get('email').value;
    const password = this.validateForm.get('password').value;
    this.authenticationService.SignIn$(email, password)
      .subscribe(
        _ => {
          const returnUrl = this.returnUrl || '/';
          this.router.navigateByUrl(returnUrl);
        },
        err => this.error = err
      );
  }
}
