import { Injectable, inject } from '@angular/core';
import { PageConfigDTO } from '@pm-models/page-config.models';
import { HttpService } from '@pm-services/http/http.service';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageConfigStore {
  readonly pageConfig$ = inject(HttpService)
    .request<PageConfigDTO>(COMMON_REQUESTS.GET_PAGE_CONFIG)
    .pipe(shareReplay(1));
}
