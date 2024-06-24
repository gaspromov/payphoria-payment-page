import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pm-order-failed',
  templateUrl: './order-failed.component.html',
  styleUrl: './order-failed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class OrderFailedComponent {}
