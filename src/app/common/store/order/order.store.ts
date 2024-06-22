import { Injectable } from '@angular/core';
import { OrderDTO } from '@pm-models/order/order.models';
import { HttpService } from '@pm-services/http/http.service';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { Subject, shareReplay, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderStore {
  readonly id$;
  readonly data$;

  readonly #data$ = new Subject<OrderDTO>();
  readonly #id$ = new Subject<string>();

  constructor(private http: HttpService) {
    this.data$ = this.#data$.asObservable().pipe(shareReplay(1));
    this.id$ = this.#id$.asObservable().pipe(shareReplay(1));
  }

  setId(id: string) {
    this.#id$.next(id);
  }

  fetchData() {
    this.http.request<OrderDTO>(COMMON_REQUESTS.GET_ORDER).subscribe({
      next: (data) => this.#data$.next(data),
      error: (err) => {
        // todo: ERROR NOTIFY HERE
      },
    });
  }

  nextOrder(data: Record<string, any>) {
    this.http.request<OrderDTO>(COMMON_REQUESTS.NEXT_ORDER).subscribe({
      next: (data) => this.#data$.next(data),
      error: (err) => {
        // todo: ERROR NOTIFY HERE
      },
    });
  }
}
