import { AsyncPipe, isPlatformServer } from '@angular/common';
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
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DropzoneComponent } from '@pm-components/dropzone/dropzone.component';
import { URL_ORDER_ID_PARAM } from '@pm-services/http/http.consts';
import { HttpRequestData } from '@pm-services/http/http.models';
import { HttpService } from '@pm-services/http/http.service';
import { Store } from '@pm-store/store';
import { NgVarDirective } from 'app/common/directives/ngvar.directive';
import { filter, finalize, interval, map, of, tap } from 'rxjs';

const POST_PROOF_IMG_REQ: HttpRequestData = {
  url: `/order/${URL_ORDER_ID_PARAM}/proof`,
  method: 'POST',
};

@Component({
  selector: 'pm-approve-waiting',
  templateUrl: './approve-waiting.component.html',
  styleUrl: './approve-waiting.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    DropzoneComponent,
    AsyncPipe,
    MatProgressSpinner,
    MatProgressBar,
    MatButtonModule,
    NgVarDirective,
  ],
})
export class ApproveWaitingComponent {
  readonly orderPending$ = this.store.order.selectPending();
  readonly proofImgUrl$ = this.store.order
    .selectData()
    .pipe(map((d) => d.payment?.proofImg));

  readonly filePending = signal(false);

  readonly selectedFile = signal<File | null>(null);
  readonly #destroyRef = inject(DestroyRef);

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private store: Store,
    private snBar: MatSnackBar,
    private http: HttpService
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }

    this.store.order.fetchData();

    interval(8000)
      .pipe(
        takeUntilDestroyed(this.#destroyRef),
        filter(() => !this.filePending())
      )
      .subscribe({
        next: () => this.store.order.fetchData(),
      });
  }

  onSend() {
    if (!this.selectedFile()) {
      this.snBar.open('Файл не выбран', undefined, {
        duration: 3000,
        panelClass: 'snackbar_warn',
      });
      return;
    }
    this.filePending.set(true);

    const data = new FormData();
    data.set('proofImg', this.selectedFile()!);

    this.http
      .request<{ proofImg: string }>(POST_PROOF_IMG_REQ, data)
      .pipe(finalize(() => this.filePending.set(false)))
      .subscribe((res) => this.store.order.patchProofImg(res.proofImg));
  }
}
