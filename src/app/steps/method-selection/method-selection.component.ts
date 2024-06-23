import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HttpService } from '@pm-services/http/http.service';
import { GET_METHOD_SELECTION_REQ } from './consts/method-selection.requests';
import { PaymentMethodDTO } from '@pm-models/order/payment-method.models';
import { finalize, shareReplay } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { COMMON_REQUESTS } from 'app/common/requests/common.requests';
import { Store } from '@pm-store/store';

@Component({
  selector: 'pm-method-selection',
  templateUrl: './method-selection.component.html',
  styleUrl: './method-selection.component.scss',
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class MethodSelectionComponent {
  readonly pending = signal(true);

  readonly methods = toSignal(this.getPaymentMethods());

  readonly selectedMethod = signal<PaymentMethodDTO | null>(null);

  constructor(private http: HttpService, private store: Store) {}

  onSubmit() {
    const selectedMethod = this.selectedMethod();
    if (!selectedMethod) {
      // todo: notify error
      return;
    }

    this.pending.set(true);

    this.store.order
      .next({
        paymentMethod: selectedMethod.id,
      })
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({ error: () => {} });
  }

  private getPaymentMethods() {
    return this.http.request<PaymentMethodDTO[]>(GET_METHOD_SELECTION_REQ).pipe(
      finalize(() => this.pending.set(false)),
      shareReplay(1)
    );
  }
}
