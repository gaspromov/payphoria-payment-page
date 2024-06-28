import { isPlatformServer } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Inject,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@pm-store/store';
import { interval } from 'rxjs';

@Component({
  selector: 'pm-approve-waiting',
  templateUrl: './approve-waiting.component.html',
  styleUrl: './approve-waiting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class ApproveWaitingComponent {
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

    interval(8000)
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe({
        next: () => this.store.order.fetchData(),
      });
  }
}
