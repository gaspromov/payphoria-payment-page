import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatFormField } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { OrderDTO } from '@pm-models/order/order.models';
import { HttpService } from '@pm-services/http/http.service';
import { Store } from '@pm-store/store';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { catchError, finalize, map, of, switchMap, take } from 'rxjs';
import { HttpRequestData } from '@pm-services/http/http.models';
import { CurrencyDTO } from '@pm-models/order/currency.models';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { QUERY_PARAMS_NAMES } from '@pm-consts/query-params-names.consts';

const GET_CYRRENCIES_REQ: HttpRequestData = {
  url: '/currencies',
  method: 'GET',
};

@Component({
  selector: 'pm-order-creating',
  templateUrl: './order-creating.component.html',
  styleUrl: './order-creating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    MatInput,
    MatFormField,
    MatSelectModule,
    AsyncPipe,
    MatProgressSpinner,
    RouterModule,
  ],
  standalone: true,
})
export class OrderCreatingComponent implements OnInit, OnDestroy {
  @Output()
  readonly destroyed = new EventEmitter<void>();

  @Output()
  readonly inited = new EventEmitter<void>();

  readonly form = new FormGroup({
    amount: new FormControl<number | null>(null, Validators.required),
    currency: new FormControl<string>('', Validators.required),
  });

  readonly merchantName$ = this.store.merchant
    .selectData()
    .pipe(map((m) => m.name));

  readonly pending = signal(false);
  readonly currencies$ = this.getCurrency();

  constructor(
    private http: HttpService,
    private store: Store,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.inited.emit();
  }

  ngOnDestroy(): void {
    this.destroyed.emit();
  }

  onCreate() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    this.pending.set(true);

    this.store.order
      .selectMerchantOrderId()
      .pipe(
        take(1),
        map((merchantOrderId) => ({
          ...this.form.value,
          merchantOrderId,
        })),
        switchMap((body) =>
          this.http.request<OrderDTO>(COMMON_REQUESTS.POST_ORDER, body)
        ),
        finalize(() => this.pending.set(false))
      )
      .subscribe({
        next: (order) => {
          this.store.order.setData(order);
          this.patchQueryParamsOrderId(order.id);
        },
        error: () => {},
      });
  }

  private patchQueryParamsOrderId(orderId: string) {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        [QUERY_PARAMS_NAMES.ORDER_ID]: orderId,
        [QUERY_PARAMS_NAMES.MERCHANT_ORDER_ID]: undefined,
      },
      queryParamsHandling: 'merge',
    });
  }

  private getCurrency() {
    this.pending.set(true);
    return this.http.request<CurrencyDTO[]>(GET_CYRRENCIES_REQ).pipe(
      finalize(() => this.pending.set(false)),
      catchError((d) =>
        of([
          {
            id: 'asdasda123',
            code: 'USD',
            name: 'Доллар',
            symbol: '$',
          },
        ])
      )
    );
  }
}
