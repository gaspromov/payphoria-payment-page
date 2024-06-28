import { AsyncPipe, NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { OrderStatuses } from '@pm-models/order/order.models';
import { Store } from '@pm-store/store';
import { NgVarDirective } from 'app/common/directives/ngvar.directive';
import { map } from 'rxjs';
import { OrderTimerComponent } from '../order-timer.component';

const STEPS_INDEXES: Record<OrderStatuses, number> = {
  [OrderStatuses.PAYMENT_METHOD_SELECTION]: 0,
  [OrderStatuses.PAYMENT_METHOD_WAITING]: 0,
  [OrderStatuses.PAYMENT_TRANSFER_WAITING]: 1,
  [OrderStatuses.PAYMENT_APPROVE_WAITING]: 2,
  [OrderStatuses.SUCCESS]: 3,
  [OrderStatuses.CANCELED]: 3,
  [OrderStatuses.FAILED]: 3,
};

const STEPS_NAMES: Record<OrderStatuses, string> = {
  [OrderStatuses.PAYMENT_METHOD_SELECTION]: 'Выберите метод оплаты',
  [OrderStatuses.PAYMENT_METHOD_WAITING]: 'Ожидаем данные для оплаты',
  [OrderStatuses.PAYMENT_TRANSFER_WAITING]: 'Отправьте перевод через ',
  [OrderStatuses.PAYMENT_APPROVE_WAITING]: 'Ожидаем подтверждения о переводе',
  [OrderStatuses.SUCCESS]: 'Успешно!',
  [OrderStatuses.CANCELED]: 'Платеж отменен',
  [OrderStatuses.FAILED]: 'Ошибка платежа',
};

@Component({
  selector: 'pm-order-stepper',
  templateUrl: './order-stepper.component.html',
  styleUrl: './order-stepper.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgVarDirective, NgClass, OrderTimerComponent, AsyncPipe],
  standalone: true,
})
export class OrderStepperComponent {
  readonly stepData$ = this.getStepData();
  readonly isTimerVisible$ = this.stepData$.pipe(
    map((d) =>
      [
        OrderStatuses.PAYMENT_APPROVE_WAITING,
        OrderStatuses.PAYMENT_TRANSFER_WAITING,
      ].includes(d.status)
    )
  );
  readonly OrderStatuses = OrderStatuses;

  get steps() {
    return Array(4);
  }

  private getStepData() {
    return inject(Store)
      .order.selectData()
      .pipe(
        // map((order) => order.status),
        map(({ status, payment }) => {
          let name = STEPS_NAMES[status];

          if (status === OrderStatuses.PAYMENT_TRANSFER_WAITING) {
            name += payment!.method.name;
          }

          return {
            index: STEPS_INDEXES[status],
            name,
            status,
          };
        })
      );
  }
}
