import { Component, ElementRef, ViewChild } from '@angular/core';
import { ProductService } from './services/product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  @ViewChild('appContainer') appContainer: ElementRef | undefined;

  constructor(protected productService:ProductService) {}

  title = 'e-commerce';

  ngAfterViewInit() {
    if (this.appContainer) {
      const containerElement = this.appContainer.nativeElement as HTMLElement;
      containerElement.style.paddingTop = `${this.productService.headerHeight}px`;
    }
  }
}
