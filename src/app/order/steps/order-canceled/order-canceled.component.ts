import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Store } from '@pm-store/store';
import { map } from 'rxjs';

@Component({
  selector: 'pm-order-canceled',
  templateUrl: './order-canceled.component.html',
  styleUrl: './order-canceled.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton, AsyncPipe],
})
export class OrderCanceledComponent {
  readonly returnLink$ = inject(Store)
    .merchant.selectData()
    .pipe(map((d) => d.returnUrls.default));
}
