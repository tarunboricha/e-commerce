import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { product } from '../data-type';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})

export class ProductFormComponent implements OnInit {

  @Input() formName: string = 'Product Form';
  @Input() buttonText: string = 'Product';
  @Input() updateProductData!: product;
  @Output() productAddUpdate: EventEmitter<product> = new EventEmitter();

  productForm!: FormGroup;
  isLoader: boolean = false;
  authSucessMessage: string | undefined;
  authFailedMessage: string | undefined;
  authSuccessMessageSubscription: Subscription | undefined;

  constructor(config: NgbDropdownConfig, private authService: AuthService) {
    config.placement = 'top-start';
    config.autoClose = true;
  }

  ngOnInit(): void {
    this.authSuccessMessageSubscription = this.authService.authSucessMessage.subscribe((sucessMessage) => {
      this.productForm.reset();
      this.isLoader = false;
      this.authSucessMessage = sucessMessage;
    });
    this.productForm = new FormGroup({
      id: new FormControl<number>(0, []),
      productName: new FormControl<string>('', [Validators.required]),
      productPrice: new FormControl<string>('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      productType: new FormControl<string>('', [Validators.required]),
      productColor: new FormControl<string>('', [Validators.required]),
      productDisc: new FormControl<string>('', [Validators.required]),
      productURL: new FormControl<string>('', [Validators.required]),
      rating: new FormControl<number>(4, [Validators.required]),
      trending: new FormControl<boolean>(false, [Validators.required]),
    });
    if (this.buttonText === 'Update Product')
      this.productForm.patchValue(this.updateProductData);
  }

  onSubmit() {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }
    // let isSame = true;
    // for (let key in this.productForm.value) {
    //   if ((this.productForm.value as any)[key] !== (this.updateProductData as any)[key]) {
    //     isSame = false;
    //     break;
    //   }
    // }
    // if (isSame) {
    //   this.authFailedMessage = "Nothing is changed";
    //   setTimeout(() => {
    //     this.authFailedMessage = undefined;
    //   }, 1500);
    //   return;
    // }
    this.isLoader = true;
    this.productAddUpdate.emit(this.productForm.value);
  }

  ngOnDestroy(): void {
    this.authSuccessMessageSubscription?.unsubscribe();
  }
}