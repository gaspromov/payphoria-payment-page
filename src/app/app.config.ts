import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { urlParamsChangerInterceptor } from '@pm-interceptors/url-params-changer.interceptor';
import { errorsHandlerInterceptor } from '@pm-interceptors/errors-handler.interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withInterceptors([urlParamsChangerInterceptor, errorsHandlerInterceptor]),
      withFetch()
    ),
    provideAnimationsAsync(),
  ],
};
