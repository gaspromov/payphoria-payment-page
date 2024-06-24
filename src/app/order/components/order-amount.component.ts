import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Store } from '@pm-store/store';
import { map } from 'rxjs';

@Component({
  selector: 'pm-order-amount',
  template: `
    <h2>{{ merchantName() }}</h2>
    <span>{{ orderAmount() }}</span>
  `,
  styles: `
    :host{
        @apply tw-grid tw-gap-0.5; 
    }

    h2{
        @apply tw-text-white/30 tw-text-base tw-font-medium;
    }

    span{
        @apply tw-font-bold tw-text-[32px] tw-leading-[48px];
    }
  `,
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderAmountComponent {
  readonly orderAmount = toSignal(
    inject(Store)
      .order.selectData()
      .pipe(map((order) => `${order.amount} ${order.currency.symbol}`))
  ) as Signal<string>;

  readonly merchantName = toSignal(
    inject(Store)
      .merchant.selectData()
      .pipe(map((merchant) => merchant.name))
  ) as Signal<string>;
}
