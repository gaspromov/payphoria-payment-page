import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'pm-page-params-failed',
  templateUrl: './page-params-failed.component.html',
  styleUrl: './page-params-failed.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PageParamsFailedComponent implements OnInit, OnDestroy {
  @Output()
  readonly inited = new EventEmitter<void>();

  @Output()
  readonly destroyed = new EventEmitter<void>();

  ngOnInit(): void {
    this.inited.emit();
  }

  ngOnDestroy(): void {
    this.destroyed.emit();
  }
}
