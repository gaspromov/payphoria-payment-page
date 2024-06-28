import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { Store } from '@pm-store/store';
import { filter, interval, map, switchMap } from 'rxjs';
import { differenceInMilliseconds } from 'date-fns';
import { AsyncPipe, DatePipe, isPlatformServer } from '@angular/common';

@Component({
  selector: 'pm-order-timer',
  template: `
    <p>
      Времени на оплату:
      {{ timeLeft$ | async | date : 'mm:ss' }}
    </p>
  `,
  styles: `p{ @apply tw-text-success tw-font-bold tw-text-xl; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [AsyncPipe, DatePipe],
  standalone: true,
})
export class OrderTimerComponent {
  readonly #platformId = inject(PLATFORM_ID);

  readonly timeLeft$ = inject(Store)
    .order.selectData()
    .pipe(
      map((order) => order.expiresAt!),
      filter(() => !isPlatformServer(this.#platformId)),
      switchMap((expiresAt) => interval(1000).pipe(map(() => expiresAt))),
      map((expiresAt) => differenceInMilliseconds(expiresAt, new Date()))
    );
}
