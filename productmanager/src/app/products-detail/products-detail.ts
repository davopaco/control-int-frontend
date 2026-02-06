import { ChangeDetectorRef, Component } from '@angular/core';
import { ApiService } from '../../core/api.service';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import ProductDto from '../../dtos/ProductDto';
import { CardModule } from 'primeng/card';
import { CarouselModule } from 'primeng/carousel';
import ImagenDto from '../../dtos/ImagenDto';
import { FileUploadEvent, FileUploadHandlerEvent, FileUploadModule } from 'primeng/fileupload';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-products-detail',
  imports: [CardModule, CarouselModule, FileUploadModule, ButtonModule],
  templateUrl: './products-detail.html',
  styleUrl: './products-detail.css',
})
export class ProductsDetail {
  public product!: ProductDto;
  public images: ImagenDto[] = [];
  public productId!: string | null;

  constructor(
    private api: ApiService,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private msg: MessageService,
  ) {
    this.productId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getProductDetailed();
    this.getImagesForProduct();
  }

  //Obtener la información del producto detallado
  getProductDetailed() {
    this.api.get<ProductDto>(`products/${this.productId}`).subscribe({
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
    this.api.get<ImagenDto[]>(`images/${this.productId}`).subscribe({
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

  async onUpload(event: FileUploadHandlerEvent) {
    const imagesToUpload = event.files;
    const reader = new FileReader();
    imagesToUpload.forEach((image) => {
      reader.readAsDataURL(image);
      reader.onload = () => this.createImage(reader.result!.toString());
    });
  }

  createImage(content: string) {
    const body = { content: content, productId: this.productId };
    this.api.post('images', body).subscribe({
      next: (data: any) => {
        this.getImagesForProduct();
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
