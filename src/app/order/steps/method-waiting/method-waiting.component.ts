import { AsyncPipe, isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatProgressBar } from '@angular/material/progress-bar';
import { Store } from '@pm-store/store';
import { finalize, interval, map, switchMap, take } from 'rxjs';
import { HttpService } from '@pm-services/http/http.service';
import { GET_HMAC_HASH_REQ } from '../method-selection/consts/method-selection.requests';

@Component({
  selector: 'pm-method-waiting',
  templateUrl: './method-waiting.component.html',
  styleUrl: './method-waiting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatProgressSpinner, MatProgressBar, AsyncPipe],
})
export class MethodWaitingComponent implements OnInit {
  readonly orderPending$ = this.store.order.selectPending();
  readonly pending = signal(false);

  readonly #destroyRef = inject(DestroyRef);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.store.order.fetchData();

    interval(10000)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.sign(),
      });
  }

  private sign() {
    this.pending.set(true);

    this.store.order
      .selectData()
      .pipe(
        take(1),
        switchMap((order) =>
          this.http
            .request<{ result: string }>(GET_HMAC_HASH_REQ, {
              string: `${order.amount}::${order.currency.id}`,
            })
            .pipe(
              map(({ result }) => ({
                result,
                paymentMethod: order.payment!.method.id,
              }))
            )
        ),
        switchMap(({ result, paymentMethod }) =>
          this.store.order.next({
            paymentMethod,
            hmacHash: result,
          })
        ),
        take(1),
        finalize(() => this.pending.set(false))
      )
      .subscribe({ error: () => {} });
  }
}
