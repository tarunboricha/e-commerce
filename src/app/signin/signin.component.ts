import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent implements OnInit {

  @Input() buttonText: string = 'Sign In';
  @Output() signIn: EventEmitter<{ email: string, password: string }> = new EventEmitter();
  signinForm!: FormGroup;
  isLoader: boolean = false;
  authFailedMessage: string | undefined;
  userAuthFailedSubcription: Subscription | undefined;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userAuthFailedSubcription = this.authService.authFailedMessage.subscribe((failedMessage) => {
      this.isLoader = false;
      this.authFailedMessage = failedMessage;
      setTimeout(() => {
        this.authFailedMessage = undefined;
      }, 2000);
    });
    this.signinForm = new FormGroup({
      email: new FormControl<string>('', [Validators.required, Validators.email]),
      password: new FormControl<string>('', [Validators.required, Validators.minLength(6)])
    });
  }

  onSignIn() {
    if (this.signinForm.invalid) {
      this.signinForm.markAllAsTouched();
      return;
    }
    this.isLoader = true;
    this.signIn.emit({ email: this.signinForm.get('email')?.value, password: this.signinForm.get('password')?.value });
  }

  ngOnDestroy(): void {
    this.userAuthFailedSubcription?.unsubscribe();
  }
}
