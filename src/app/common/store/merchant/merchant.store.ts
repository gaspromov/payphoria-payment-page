import { Injectable } from '@angular/core';
import { MerchantDTO } from '@pm-models/merchant.models';
import { HttpService } from '@pm-services/http/http.service';
import { MERCHANT_MOCK } from 'app/common/mocks/merchant.mock';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import {
  BehaviorSubject,
  ReplaySubject,
  catchError,
  of,
  shareReplay,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MerchantStore {
  readonly token$;
  readonly data$;

  readonly #token$ = new BehaviorSubject<string | null>(null);
  readonly #data$ = new ReplaySubject<MerchantDTO>(1);

  constructor(private http: HttpService) {
    this.token$ = this.#token$.asObservable().pipe(shareReplay());
    this.data$ = this.#data$.asObservable().pipe(shareReplay(1));
  }

  setToken(token: string) {
    this.#token$.next(token);
  }

  fetchData() {
    this.http
      .request<MerchantDTO>(COMMON_REQUESTS.GET_MERCHANT)
      // TODO: удалить мок
      .pipe(catchError(() => of(MERCHANT_MOCK)))
      .subscribe({
        next: (data) => this.#data$.next(data),
        error: () => {},
      });
  }
}
