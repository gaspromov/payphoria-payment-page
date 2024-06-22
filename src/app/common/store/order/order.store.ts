import { Injectable } from '@angular/core';
import { OrderDTO } from '@pm-models/order/order.models';
import { HttpService } from '@pm-services/http/http.service';
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
    this.fetchData();
  }

  fetchData() {
    // this.orderId$
    //   .pipe(
    //     take(1)
    //     // switchMap to req
    //   )
    //   .subscribe({
    //     next: (order) => {
    //       // set order
    //     },
    //     error: (err) => {
    //       // handle error
    //     },
    //   });
  }

  nextOrder(data: Record<string, any>) {}
}
