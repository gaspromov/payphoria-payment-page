import { NgOptimizedImage, isPlatformServer } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { fromEvent, map } from 'rxjs';

const DRAG_CLASS = 'dragstarted';

@Component({
  selector: 'pm-dropzone',
  templateUrl: './dropzone.component.html',
  styleUrl: './dropzone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgOptimizedImage, MatIconButton],
})
export class DropzoneComponent implements AfterViewInit {
  @Input()
  acceptTypesDisplay!: string[];

  @Input()
  acceptedTypes!: string[];

  @ViewChild('dropzone', { static: true })
  readonly dropzone!: ElementRef<HTMLElement>;

  @Input()
  dragzoneType?: 'body';

  @Output()
  readonly selectFile = new EventEmitter<File | null>();

  readonly selectedFile = signal<File | null>(null);

  readonly #platformId = inject(PLATFORM_ID);
  readonly #destroyRef = inject(DestroyRef);

  constructor(private snBar: MatSnackBar) {}

  ngAfterViewInit(): void {
    if (isPlatformServer(this.#platformId)) {
      return;
    }

    const dragzone =
      this.dragzoneType === 'body'
        ? window.document.body
        : this.dropzone.nativeElement;

    let blockedByEnter = false;

    fromEvent(dragzone, 'dragenter')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        blockedByEnter = true;
        this.toggleClass(dragzone, 'add');
      });

    fromEvent(dragzone, 'dragleave')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe(() => {
        if (!blockedByEnter) {
          this.toggleClass(dragzone, 'remove');
        }
        blockedByEnter = false;
      });

    fromEvent(dragzone, 'dragover')
      .pipe(takeUntilDestroyed(this.#destroyRef))
      .subscribe((event) => event.preventDefault());

    fromEvent(dragzone, 'drop')
      .pipe(
        map((d) => d as DragEvent),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe((event: DragEvent) => {
        this.toggleClass(dragzone, 'remove');
        this.handleDrop(event);
      });
  }

  onRemoveFile(event?: MouseEvent) {
    event?.stopPropagation();
    event?.preventDefault();
    this.selectedFile.set(null);
    this.selectFile.emit(null);
  }

  onSelectFile(input: HTMLInputElement) {
    let files = input.files;
    let file = files?.[0];

    if (!file) {
      this.onRemoveFile();
      this.snBar.open('Файл не выбран', undefined, {
        duration: 3000,
        panelClass: 'snackbar_warn',
      });
      return;
    }
    this.selectFile.emit(file);
    this.selectedFile.set(file);
  }

  private toggleClass(dragzone: HTMLElement, action: 'remove' | 'add') {
    dragzone.classList[action](DRAG_CLASS);

    if (this.dragzoneType) {
      this.dropzone.nativeElement.classList[action](DRAG_CLASS);
    }
  }

  private handleDrop(event: DragEvent) {
    event.preventDefault();

    const dataTransfer = event.dataTransfer!;

    if (dataTransfer.files.length != 1) {
      this.snBar.open('Перетащите один файл', undefined, {
        duration: 3000,
        panelClass: 'snackbar_warn',
      });
      return;
    }

    const file = dataTransfer.files.item(0)!;

    if (!this.acceptedTypes.includes(file.type)) {
      this.snBar.open(`Недопустимый формат файла`, undefined, {
        duration: 3000,
        panelClass: 'snackbar_warn',
      });
      return;
    }

    this.selectedFile.set(file);
    this.selectFile.emit(file);
  }
}
