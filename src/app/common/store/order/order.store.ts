import { Injectable } from '@angular/core';
import { OrderDTO } from '@pm-models/order/order.models';
import { HttpService } from '@pm-services/http/http.service';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import {
  Subject,
  catchError,
  finalize,
  map,
  shareReplay,
  take,
  tap,
  throwError,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderStore {
  readonly id$;
  readonly data$;
  readonly merchantOrderId$;
  readonly pending$;

  readonly #data$ = new Subject<OrderDTO>();
  readonly #id$ = new Subject<string>();
  readonly #merchantOrderId$ = new Subject<string>();
  readonly #pending$ = new Subject<boolean>();

  constructor(private http: HttpService) {
    this.data$ = this.#data$.asObservable().pipe(shareReplay(1));
    this.id$ = this.#id$.asObservable().pipe(shareReplay(1));
    this.merchantOrderId$ = this.#merchantOrderId$
      .asObservable()
      .pipe(shareReplay(1));
    this.pending$ = this.#pending$.asObservable().pipe(shareReplay(1));
  }

  setId(id: string) {
    this.#id$.next(id);
  }

  setMerchantOrderId(id: string) {
    this.#merchantOrderId$.next(id);
  }

  fetchData() {
    this.#pending$.next(true);

    this.http
      .request<OrderDTO>(COMMON_REQUESTS.GET_ORDER)
      .pipe(finalize(() => this.#pending$.next(false)))
      .subscribe({
        next: (data) => this.#data$.next(data),
        error: (err) => {
          // todo: ERROR NOTIFY HERE
        },
      });
  }

  next(data: Record<string, any>) {
    this.#pending$.next(true);

    return this.http.request<OrderDTO>(COMMON_REQUESTS.NEXT_ORDER, data).pipe(
      tap(
        (order) => this.#data$.next(order),
        finalize(() => this.#pending$.next(false))
      ),
      catchError((err) => {
        // todo: ERROR NOTIFY HERE

        return throwError(() => err);
      })
    );
  }

  setData(order: OrderDTO) {
    this.#id$.next(order.id);
    this.#data$.next(order);
  }

  patchProofImg(proofImg: string) {
    this.#data$
      .pipe(
        take(1),
        map(
          (oldOrder) =>
            ({
              ...oldOrder,
              payment: {
                ...oldOrder.payment,
                proofImg,
              },
            } as OrderDTO)
        )
      )
      .subscribe((newOrder) => this.#data$.next(newOrder));
  }
}
