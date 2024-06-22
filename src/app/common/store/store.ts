import { Injectable, inject } from '@angular/core';
import { MerchantStore } from './merchant/merchant.store';
import { OrderStore } from './order/order.store';

@Injectable({
  providedIn: 'root',
})
export class Store {
  readonly #merchant = inject(MerchantStore);
  readonly #order = inject(OrderStore);

  get merchant() {
    return {
      selectToken: () => this.#merchant.token$,
      selectData: () => this.#merchant.data$,
      setToken: (token: string): void => this.merchant.setToken(token),
      fetchData: (): void => this.merchant.fetchData(),
    };
  }

  get order() {
    return {
      selectId: () => this.#order.id$,
      selectData: () => this.#order.data$,
      setId: (id: string) => this.#order.setId(id),
      fetchData: () => this.#order.fetchData(),
    };
  }
}
