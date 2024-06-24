import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderStatuses } from '@pm-models/order/order.models';
import { Store } from '@pm-store/store';
import { map } from 'rxjs';
import { OrderCanceledComponent } from './steps/order-canceled/order-canceled.component';
import { OrderSuccessComponent } from './steps/order-success/order-success.component';
import { OrderFailedComponent } from './steps/order-failed/order-failed.component';
import { MethodSelectionComponent } from './steps/method-selection/method-selection.component';
import { MethodWaitingComponent } from './steps/method-waiting/method-waiting.component';
import { TransferWaitingComponent } from './steps/transfer-waiting/transfer-waiting.component';
import { ApproveWaitingComponent } from './steps/approve-waiting/approve-waiting.component';
import { OrderAmountComponent } from './components/order-amount.component';
import { OrderStepperComponent } from './components/order-stepper/order-stepper.component';

@Component({
  selector: 'pm-order',
  templateUrl: './order.component.html',
  styleUrl: './order.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    OrderAmountComponent,
    OrderStepperComponent,
    MethodSelectionComponent,
    MethodWaitingComponent,
    TransferWaitingComponent,
    ApproveWaitingComponent,
    OrderCanceledComponent,
    OrderSuccessComponent,
    OrderFailedComponent,
  ],
})
export class OrderComponent {
  readonly status = toSignal(this.getStatus()) as Signal<OrderStatuses>;
  readonly OrderStatuses = OrderStatuses;

  readonly paymentMethodImg = toSignal(this.getPaymentMethodImg());

  private getStatus() {
    return inject(Store)
      .order.selectData()
      .pipe(map((d) => d.status));
  }

  private getPaymentMethodImg() {
    return inject(Store)
      .order.selectData()
      .pipe(map((d) => d.payment?.method.image));
  }
}
