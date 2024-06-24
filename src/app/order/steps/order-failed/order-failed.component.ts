import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Store } from '@pm-store/store';
import { map } from 'rxjs';

@Component({
  selector: 'pm-order-failed',
  templateUrl: './order-failed.component.html',
  styles: ':host{ @apply tw-grid tw-gap-5; }',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton, AsyncPipe],
})
export class OrderFailedComponent {
  readonly supportLink$ = inject(Store)
    .pageCongif.selectData()
    .pipe(map((d) => d.supportLink));

  readonly returnUrl$ = inject(Store)
    .merchant.selectData()
    .pipe(
      map((d) => d.returnUrls),
      map((res) => res.failed || res.default)
    );
}
