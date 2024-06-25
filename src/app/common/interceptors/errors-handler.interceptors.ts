import { PLATFORM_ID, inject } from '@angular/core';
import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { isPlatformBrowser } from '@angular/common';

export const errorsHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const snBar = inject(MatSnackBar);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      let msg: string | null = null;

      if (
        err.status < HttpStatusCode.InternalServerError &&
        err?.error?.message
      ) {
        msg = capitalizeFirstLetter(err.error.message);
      }

      if (err.status === 0) {
        msg = 'Нет соединения с интернетом';
      } else if (err.status >= HttpStatusCode.InternalServerError) {
        msg =
          (typeof err.error.message === 'string' && err.error.message) ||
          `Error ${err.status}: Сервис временно недоступен`;
      } else if (
        err.status >= HttpStatusCode.BadRequest &&
        err.status <= HttpStatusCode.InternalServerError
      ) {
        msg = `${err.error.message || err.error.error || err.message}`;
      }

      if (msg && isPlatformBrowser(platformId)) {
        snBar.open(msg, undefined, {
          duration: 4000,
          panelClass: 'snackbar_warn',
        });
      }

      return throwError(() => err);
    })
  );
};

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
