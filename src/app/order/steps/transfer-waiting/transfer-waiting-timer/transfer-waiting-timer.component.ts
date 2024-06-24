import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'pm-transfer-waiting-timer',
  template: ``,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class TransferWaitingTimerComponent {
  @Input()
  expiresAt!: number;
}
