import { Injectable, inject } from '@angular/core';
import { MerchantStore } from './merchant/merchant.store';
import { OrderStore } from './order/order.store';
import { OrderDTO } from '@pm-models/order/order.models';

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
      setToken: (token: string): void => this.#merchant.setToken(token),
      fetchData: (): void => this.#merchant.fetchData(),
    };
  }

  get order() {
    return {
      selectId: () => this.#order.id$,
      selectData: () => this.#order.data$,
      selectMerchantOrderId: () => this.#order.merchantOrderId$,
      selectPending: () => this.#order.pending$,
      setId: (id: string) => this.#order.setId(id),
      setMerchantOrderId: (id: string) => this.#order.setMerchantOrderId(id),
      setData: (order: OrderDTO) => this.#order.setData(order),
      patchProofImg: (imgUrl: string) => this.#order.patchProofImg(imgUrl),
      fetchData: () => this.#order.fetchData(),
      next: (data: Record<string, any>) => this.#order.next(data),
    };
  }
}
