import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  HostBinding,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Params, RouterOutlet } from '@angular/router';
import { QUERY_PARAMS_NAMES } from '@pm-consts/query-params-names.consts';
import { OrderStatuses } from '@pm-models/order/order.models';
import { Store } from '@pm-store/store';
import { Subject, filter, map, takeUntil } from 'rxjs';
import { OrderCreatingComponent } from './order-creating/order-creating.component';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { OrderComponent } from './order/order.component';
import { NgVarDirective } from './common/directives/ngvar.directive';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageParamsFailedComponent } from './page-params-failed/page-params-failed.component';

enum PageStates {
  PENDING = 'PENDING',
  ORDER_CREATING = 'ORDER_CREATING',
  ORDER = 'ORDER',
  WRONG_DATA = 'WRONG_DATA',
}

@Component({
  selector: 'pm-root',
  standalone: true,
  imports: [
    RouterOutlet,
    OrderCreatingComponent,
    PageParamsFailedComponent,
    NgOptimizedImage,
    MatButtonModule,
    OrderComponent,
    AsyncPipe,
    NgVarDirective,
    MatProgressSpinner,
  ],
  providers: [MatSnackBar],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  readonly state = signal<PageStates>(PageStates.PENDING);

  readonly pageConfig$ = this.store.pageCongif.selectData();

  readonly PageStates = PageStates;
  readonly OrderStatuses = OrderStatuses;

  readonly #destroyRef = inject(DestroyRef);

  readonly maxWidth = signal<string | null>(null);

  constructor(private activatedRoute: ActivatedRoute, private store: Store) {}

  @HostBinding('style.--max-content-width')
  get _maxWidth() {
    return this.maxWidth() || '56rem';
  }

  ngOnInit(): void {
    this.setInitialStates();
    this.listenOrder();
  }

  private listenOrder() {
    this.store.order
      .selectData()
      .pipe(takeUntilDestroyed(this.#destroyRef), filter(Boolean))
      .subscribe({
        next: () => this.state.set(PageStates.ORDER),
        error: () => this.state.set(PageStates.WRONG_DATA),
      });
  }

  private setInitialStates() {
    const subCompleter$ = new Subject<void>();
    this.activatedRoute.queryParams
      .pipe(
        map((queryParams) => this.getInitialData(queryParams)),
        takeUntilDestroyed(this.#destroyRef),
        takeUntil(subCompleter$)
      )
      .subscribe(({ merchantOrderId, merchantToken, orderId }) => {
        if (!merchantToken) {
          this.state.set(PageStates.WRONG_DATA);
          return;
        }

        if (merchantToken) {
          this.store.merchant.setToken(merchantToken);
          this.store.merchant.fetchData();
          this.store.pageCongif.fetchData();
        }

        if (orderId) {
          this.state.set(PageStates.PENDING);
          this.store.order.setId(orderId);
          this.store.order.fetchData();
        } else if (merchantOrderId) {
          this.store.order.setMerchantOrderId(merchantOrderId);
          this.state.set(PageStates.ORDER_CREATING);
        } else {
          this.state.set(PageStates.WRONG_DATA);
        }
        subCompleter$.next();
        subCompleter$.complete();
      });
  }

  private getInitialData(queryParams: Params) {
    const merchantOrderId = queryParams[QUERY_PARAMS_NAMES.MERCHANT_ORDER_ID];
    const merchantToken = queryParams[QUERY_PARAMS_NAMES.MERCHANT_TOKEN]!;
    const orderId = queryParams[QUERY_PARAMS_NAMES.ORDER_ID];

    return { merchantOrderId, merchantToken, orderId };
  }
}
