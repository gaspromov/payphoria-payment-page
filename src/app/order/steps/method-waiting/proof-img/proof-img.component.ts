import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { URL_ORDER_ID_PARAM } from '@pm-services/http/http.consts';
import { HttpRequestData } from '@pm-services/http/http.models';
import { HttpService } from '@pm-services/http/http.service';
import { Store } from '@pm-store/store';
import { finalize, map, switchMap } from 'rxjs';

const UPLOAD_PROOF_IMG_REQ: HttpRequestData = {
  url: `/order/${URL_ORDER_ID_PARAM}/proof`,
  method: 'POST',
};

@Component({
  selector: 'pm-proof-img',
  templateUrl: './proof-img.component.html',
  styleUrl: './proof-img.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  standalone: true,
})
export class ProofImgComponent {
  readonly pending = signal(false);
  readonly proofImg = toSignal(this.getProofImg());

  constructor(private http: HttpService, private store: Store) {}

  uploadFile(event: Event) {
    let formData = this.getFormData(event);
    if (!formData) {
      return;
    }

    this.pending.set(true);
    this.http
      .request<{ proofImg: string }>(UPLOAD_PROOF_IMG_REQ, formData)
      .pipe(finalize(() => this.pending.set(false)))
      .subscribe({
        next: (res) => this.store.order.patchProofImg(res.proofImg),
        error: () => {},
      });
  }

  private getFormData(event: Event): FormData | null {
    let target = (event.target || event.srcElement) as HTMLInputElement;
    let files = target.files as FileList;
    let file = files[0];

    let formData: FormData = new FormData();

    formData.set('file', file);

    return file ? formData : null;
  }

  private getProofImg() {
    return this.store.order
      .selectData()
      .pipe(map((order) => order.payment!.proofImg));
  }
}
