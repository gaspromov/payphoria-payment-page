import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LazyLoadingSpinnerComponent } from './common/components/lazy-loading-spinner/lazy-loading-spinner.component';

@Component({
  selector: 'pm-root',
  standalone: true,
  imports: [RouterOutlet, LazyLoadingSpinnerComponent],
  template: ` <csd-lazy-loading-spinner /> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}
