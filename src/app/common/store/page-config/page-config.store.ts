import { Injectable, inject } from '@angular/core';
import { PageConfigDTO } from '@pm-models/page-config.models';
import { HttpService } from '@pm-services/http/http.service';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { ReplaySubject, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageConfigStore {
  readonly data$;
  readonly #data$ = new ReplaySubject<PageConfigDTO>(1);

  constructor(private http: HttpService) {
    this.data$ = this.#data$.asObservable().pipe(shareReplay(1));
  }

  fetch() {
    this.http
      .request<PageConfigDTO>(COMMON_REQUESTS.GET_PAGE_CONFIG)
      .subscribe({
        next: (res) => this.#data$.next(res),
      });
  }
}
