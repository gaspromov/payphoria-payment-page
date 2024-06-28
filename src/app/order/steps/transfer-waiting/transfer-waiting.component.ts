import { AsyncPipe, NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnInit,
  Signal,
  ViewChild,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OrderPaymentDTO } from '@pm-models/order/order.models';
import { UtilsService } from '@pm-services/utils.service';
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
    MatIconButton,
    NgVarDirective,
    AsyncPipe,
    MatProgressSpinner,
    NgClass,
    NgOptimizedImage,
  ],
})
export class TransferWaitingComponent implements OnInit {
  readonly inputFocused = signal(false);
  readonly order$ = this.store.order.selectData();

  readonly amountControl = new FormControl<number | null>(
    null,
    Validators.required
  );

  readonly pending = signal(false);

  constructor(private store: Store, private utils: UtilsService) {}

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

  onCopy(event: MouseEvent) {
    event.stopPropagation();
    this.utils.copy(String(this.amountControl.value));
  }
}
