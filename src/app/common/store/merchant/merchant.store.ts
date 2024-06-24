import { Injectable } from '@angular/core';
import { MerchantDTO } from '@pm-models/merchant.models';
import { HttpService } from '@pm-services/http/http.service';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { ReplaySubject, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MerchantStore {
  readonly token$;
  readonly data$;

  readonly #token$ = new ReplaySubject<string>(1);
  readonly #data$ = new ReplaySubject<MerchantDTO>(1);

  constructor(private http: HttpService) {
    this.token$ = this.#token$.asObservable().pipe(shareReplay());
    this.data$ = this.#data$.asObservable().pipe(shareReplay(1));
  }

  setToken(token: string) {
    this.#token$.next(token);
  }

  fetchData() {
    this.http.request<MerchantDTO>(COMMON_REQUESTS.GET_MERCHANT).subscribe({
      next: (data) => this.#data$.next(data),
      error: () => {},
    });
  }
}
