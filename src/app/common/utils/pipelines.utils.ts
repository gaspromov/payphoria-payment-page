import { Observable, distinctUntilChanged } from 'rxjs';

export const distinctUntilChangedJSON =
  () =>
  <T>(source: Observable<T>) =>
    source.pipe(
      distinctUntilChanged(
        (prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)
      )
    );
