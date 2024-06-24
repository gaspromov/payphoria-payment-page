import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pm-order-canceled',
  templateUrl: './order-canceled.component.html',
  styleUrl: './order-canceled.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrderCanceledComponent {}
