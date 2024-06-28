import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OrderPaymentDTO } from '@pm-models/order/order.models';
import { Store } from '@pm-store/store';
import { NgVarDirective } from 'app/common/directives/ngvar.directive';
import { finalize, map, take } from 'rxjs';

@Component({
  selector: 'pm-transfer-waiting',
  templateUrl: './transfer-waiting.component.html',
  styleUrl: './transfer-waiting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButton,
    NgVarDirective,
    AsyncPipe,
    MatProgressSpinner,
  ],
})
export class TransferWaitingComponent implements OnInit {
  readonly paymentData$ = this.getPaymentData();

  readonly amountControl = new FormControl<number | null>(
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
      .subscribe((res) => this.amountControl.setValue(res));
  }

  onApprove() {
    if (this.amountControl.invalid) {
      return;
    }

    this.pending.set(true);

    this.store.order
      .next({
        amount: this.amountControl.value,
      })
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({ error: () => {} });
  }

  private getPaymentData() {
    return this.store.order.selectData().pipe(map((order) => order.payment!));
  }
}
