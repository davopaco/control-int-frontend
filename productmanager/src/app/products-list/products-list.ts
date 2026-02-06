import { ChangeDetectorRef, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageService } from 'primeng/api';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApiService } from '../../core/api.service';
import ProductDto from '../../dtos/ProductDto';
import { Router } from '@angular/router';
import StatusesDto from '../../dtos/StatusDto';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-products-list',
  imports: [
    TableModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    InputNumberModule,
    SelectModule,
  ],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList {
  public productos: ProductDto[] = [];
  public estados: StatusesDto[] = [];
  public productosForm!: FormGroup;
  public visible: boolean = false;
  public updating: boolean = false;
  public updatingProdId: number = -1;

  constructor(
    private api: ApiService,
    private msg: MessageService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
  ) {}

  //Usado al inicializarse el componente.
  ngOnInit() {
    this.initProductosForm();
    this.getProducts();
    this.getStatuses();
  }

  initProductosForm() {
    this.productosForm = this.fb.group({
      id: [null],
      nombre: [null, Validators.required],
      descripcion: [null, Validators.required],
      precio: [null, Validators.required],
      estadoId: [null, Validators.required],
    });
  }

  //Obtener el listado de los productos.
  getProducts() {
    this.api.get<ProductDto[]>('products').subscribe({
      next: (data: ProductDto[]) => {
        this.productos = data;
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

  //Obtener el listado de los estados.
  getStatuses() {
    this.api.get<StatusesDto[]>('statuses').subscribe({
      next: (data: StatusesDto[]) => {
        this.estados = data;
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

  //Borrar el producto
  deleteProduct(id: number) {
    this.api.delete(`products/${id}`).subscribe({
      next: (data: any) => {
        this.getProducts();
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

  viewUpdForm(id: number) {
    this.visible = true;
    this.updating = true;
    this.updatingProdId = id;

    // Popular los valores del formulario
    const product = this.productos.find((producto) => producto.id == this.updatingProdId);
    console.log(product);
    console.log(this.productos);
    this.productosForm.patchValue({
      nombre: product?.nombre,
      descripcion: product?.descripcion,
      precio: product?.precio,
      estadoId: product?.estadoId,
    });
  }

  //Actualizar formulario
  updateProduct() {
    if (this.productosForm.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Campos incorrectos o sin llenar',
        detail: 'Algunos campos se encuentran sin llenar. Verifica',
      });
      return;
    }

    this.api.put(`products/${this.updatingProdId}`, this.productosForm.value).subscribe({
      next: () => {
        this.getProducts();
        this.initProductosForm();
        this.visible = false;
      },
      error: (data) => {
        console.log(data);
        this.msg.add({
          severity: 'error',
          summary: 'An error occurred',
          detail: data.error,
        });
      },
    });
  }

  //Navegar a una vista de detalles
  viewDetails(id: number) {
    this.router.navigate([id]);
  }

  //Enviar el formulario
  submitForm() {
    //En caso de que sea una actualización al producto, se hace el llamado a la correspondiente función para ejecutar el submit al API endpoint.
    if (this.updating) {
      this.updateProduct();
      return;
    }

    //Validación de que el formulario esté correcto
    if (this.productosForm.invalid) {
      this.msg.add({
        severity: 'warn',
        summary: 'Campos incorrectos o sin llenar',
        detail: 'Algunos campos se encuentran sin llenar. Verifica',
      });
      return;
    }

    //Creación del producto
    this.api.post(`products`, this.productosForm.value).subscribe({
      next: () => {
        this.getProducts();
        this.initProductosForm();
        this.visible = false;
      },
      error: (data) => {
        this.msg.add({
          severity: 'error',
          summary: 'An error occurred',
          detail: data.error,
        });
      },
    });
  }
}
