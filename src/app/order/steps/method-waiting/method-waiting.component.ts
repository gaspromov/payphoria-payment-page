import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  OnInit,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@pm-store/store';
import { interval } from 'rxjs';

@Component({
  selector: 'pm-method-waiting',
  templateUrl: './method-waiting.component.html',
  styleUrl: './method-waiting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class MethodWaitingComponent implements OnInit {
  readonly pending = signal(this.store.order.selectPending());

  readonly #destroyRef = inject(DestroyRef);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.store.order.fetchData();

    interval(5000)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.store.order.fetchData(),
      });
  }
}
