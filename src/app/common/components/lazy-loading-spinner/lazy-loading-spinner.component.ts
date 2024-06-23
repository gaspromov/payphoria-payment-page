import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
} from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'pm-lazy-loading-spinner',
  template: `
    <mat-progress-bar *ngIf="show()" mode="indeterminate" color="primary" />
  `,
  imports: [MatProgressBarModule, CommonModule],
  standalone: true,
  styles: `:host{
    @apply tw-fixed tw-top-0 tw-left-0 tw-z-30 tw-w-full;
  }`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LazyLoadingSpinnerComponent {
  readonly show = signal(false);
  readonly #destroyRef = inject(DestroyRef);

  constructor(private router: Router) {
    this.listenRouteLoading();
  }

  private listenRouteLoading() {
    this.router.events
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => {
        if (event instanceof NavigationStart) {
          this.show.set(true);
        } else if (this.show() == false) {
          return;
        } else if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError
        ) {
          this.show.set(false);
          // todo: ERROR NOTIFY HERE
        }
      });
  }
}
