import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import ProductDto from '../../dtos/ProductDto';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import ImagenDto from '../../dtos/ImagenDto';

@Component({
  selector: 'app-products-detail',
  imports: [CardModule, CarouselModule],
  templateUrl: './products-detail.html',
  styleUrl: './products-detail.css',
})
export class ProductsDetail {
  public product!: ProductDto;
  public images: ImagenDto[] = [];

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private msg: MessageService,
  ) {}

  ngOnInit() {
    this.getProductDetailed();
    this.getImagesForProduct();
  }

  //Obtener la información del producto detallado
  getProductDetailed() {
    const responseId = this.route.snapshot.paramMap.get('id');
    this.api.get<ProductDto>(`products/${responseId}`).subscribe({
      next: (data: ProductDto) => {
        this.product = data;
        this.cdr.detectChanges();
      },
      error: (data: any) => {
        this.msg.add({
          severity: 'error',
          summary: 'An error occurred',
          detail: data.error,
        });
      },
    });
  }

  getImagesForProduct() {
    const responseId = this.route.snapshot.paramMap.get('id');
    this.api.get<ImagenDto[]>(`images/${responseId}`).subscribe({
      next: (data: ImagenDto[]) => {
        this.images = data;
        this.cdr.detectChanges();
      },
      error: (data: any) => {
        this.msg.add({
          severity: 'error',
          summary: 'An error occurred',
          detail: data.error,
        });
      },
    });
  }
}
