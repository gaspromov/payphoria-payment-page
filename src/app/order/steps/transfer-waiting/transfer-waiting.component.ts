import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, Validators } from '@angular/forms';
import { OrderPaymentDTO } from '@pm-models/order/order.models';
import { Store } from '@pm-store/store';
import { finalize, map, take } from 'rxjs';

@Component({
  selector: 'pm-transfer-waiting',
  templateUrl: './transfer-waiting.component.html',
  styleUrl: './transfer-waiting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class TransferWaitingComponent implements OnInit {
  readonly paymentData = toSignal(
    this.getPaymentData()
  ) as Signal<OrderPaymentDTO>;

  readonly orderAmountControl = new FormControl<number | null>(
    null,
    Validators.required
  );

  readonly pending = signal(false);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.order
      .selectData()
      .pipe(
        take(1),
        map((order) => order.amount)
      )
      .subscribe((res) => this.orderAmountControl.setValue(res));
  }

  onApprove() {
    if (this.orderAmountControl.invalid) {
      return;
    }

    this.pending.set(true);

    this.store.order
      .next({
        amount: this.orderAmountControl.value,
      })
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({ error: () => {} });
  }

  private getPaymentData() {
    return this.store.order.selectData().pipe(map((order) => order.payment!));
  }
}
