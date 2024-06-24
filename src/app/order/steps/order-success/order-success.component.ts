import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pm-order-success',
  templateUrl: './order-success.component.html',
  styleUrl: './order-success.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrderSuccessComponent {}
