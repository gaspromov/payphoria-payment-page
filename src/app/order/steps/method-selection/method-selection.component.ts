import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpService } from '@pm-services/http/http.service';
import {
  GET_HMAC_HASH_REQ,
  GET_METHOD_SELECTION_REQ,
} from './consts/method-selection.requests';
import { PaymentMethodDTO } from '@pm-models/order/payment-method.models';
import { finalize, shareReplay, switchMap } from 'rxjs';
import { Store } from '@pm-store/store';
import { AsyncPipe, NgOptimizedImage } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'pm-method-selection',
  templateUrl: './method-selection.component.html',
  styleUrl: './method-selection.component.scss',
  imports: [AsyncPipe, MatButton, MatProgressSpinner, NgOptimizedImage],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MethodSelectionComponent {
  readonly pending = signal(false);

  readonly methods$ = this.getPaymentMethods();

  readonly selectedMethod = signal<PaymentMethodDTO | null>(null);

  constructor(
    private http: HttpService,
    private store: Store,
    private snBar: MatSnackBar
  ) {}

  onSubmit() {
    const selectedMethod = this.selectedMethod();
    if (!selectedMethod) {
      this.snBar.open('Метод оплаты не выбран', undefined, {
        panelClass: 'snackbar_warn',
        duration: 4000,
      });
      return;
    }

    this.pending.set(true);

    this.store.order
      .selectData()
      .pipe(
        switchMap((order) =>
          this.http.request<{ result: string }>(GET_HMAC_HASH_REQ, {
            string: `${order.amount}::${order.currency.id}`,
          })
        ),
        switchMap(({ result }) =>
          this.store.order.next({
            paymentMethod: selectedMethod.id,
            hmacHash: result,
          })
        )
      )
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({ error: () => {} });
  }

  private getPaymentMethods() {
    this.pending.set(true);
    return this.http.request<PaymentMethodDTO[]>(GET_METHOD_SELECTION_REQ).pipe(
      finalize(() => this.pending.set(false)),
      shareReplay(1)
    );
  }
}
