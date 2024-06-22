import { Injectable } from '@angular/core';
import { MerchantDTO } from '@pm-models/merchant.models';
import { HttpService } from '@pm-services/http/http.service';
import { ReplaySubject, Subject, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MerchantStore {
  readonly token$;
  readonly data$;

  readonly #token$ = new Subject<string>();
  readonly #data$ = new Subject<MerchantDTO>();

  constructor(private http: HttpService) {
    this.token$ = this.#token$.asObservable().pipe(shareReplay(1));
    this.data$ = this.#data$.asObservable().pipe(shareReplay(1));
  }

  setToken(token: string) {
    this.#token$.next(token);
  }

  fetchData() {}
}
