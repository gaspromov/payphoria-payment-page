import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { Store } from '@pm-store/store';
import {
  Subject,
  distinctUntilChanged,
  filter,
  interval,
  map,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { differenceInMilliseconds, isBefore } from 'date-fns';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'pm-order-timer',
  template: `
    <p>
      Времени на оплату:
      {{ timeLeft() | date : 'mm:ss' }}
    </p>
  `,
  styles: `p{ @apply tw-text-success tw-font-bold md:tw-text-xl tw-text-base; }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DatePipe],
  standalone: true,
})
export class OrderTimerComponent implements OnInit, OnDestroy {
  readonly timeLeft = signal<number | null>(0);

  readonly #platformId = inject(PLATFORM_ID);
  readonly #intervalDestroyer$ = new Subject<void>();
  readonly #destroyRef = inject(DestroyRef);

  constructor(private store: Store, private snBar: MatSnackBar) {}

  ngOnInit(): void {
    this.store.order
      .selectData()
      .pipe(
        takeUntil(this.#intervalDestroyer$),
        map((order) => order.expiresAt!),
        distinctUntilChanged(),
        tap((expiresAt) => this.setTimeLeft(expiresAt)),
        filter(() => isPlatformBrowser(this.#platformId)),
        switchMap((expiresAt) => interval(1000).pipe(map(() => expiresAt)))
      )
      .subscribe((expiresAt) => this.setTimeLeft(expiresAt));
  }

  ngOnDestroy(): void {
    this.#intervalDestroyer$.next();
    this.#intervalDestroyer$.complete();
  }

  private setTimeLeft(expiresAt: string) {
    if (isBefore(new Date(expiresAt), new Date())) {
      this.timeLeft.set(0);
      this.#intervalDestroyer$.next();
      this.snBar.open('Заказ просрочен', undefined, {
        panelClass: 'snackbar_warn',
      });
      this.intervalFetchOrder();
      return;
    }
    const difference = differenceInMilliseconds(
      new Date(expiresAt),
      new Date()
    );
    this.timeLeft.set(difference);
  }

  private intervalFetchOrder() {
    this.store.order.fetchData();
    interval(6000)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => this.store.order.fetchData());
  }
}
