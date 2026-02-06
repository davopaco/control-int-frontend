import { Routes } from '@angular/router';
import { ProductsList } from './products-list/products-list';
import { ProductsDetail } from './products-detail/products-detail';

export const routes: Routes = [
  {
    path: '',
    component: ProductsList,
  },
  {
    path: ':id',
    component: ProductsDetail,
  },
];
