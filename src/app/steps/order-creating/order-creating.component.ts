import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrderDTO } from '@pm-models/order/order.models';
import { HttpService } from '@pm-services/http/http.service';
import { Store } from '@pm-store/store';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { finalize, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'pm-order-creating',
  templateUrl: './order-creating.component.html',
  styleUrl: './order-creating.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, ReactiveFormsModule],
  standalone: true,
})
export class OrderCreatingComponent {
  readonly form = new FormGroup({
    amount: new FormControl<number | null>(null, Validators.required),
    currency: new FormControl<string>('', Validators.required),
  });

  readonly pending = signal(false);

  constructor(private http: HttpService, private store: Store) {}

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
        next: (order) => this.store.order.setData(order),
        error: (err) => {
          // todo: вывод ошибки
        },
      });
  }
}
