import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { combineLatest, switchMap } from 'rxjs';
import { Store } from '@pm-store/store';
import {
  URL_MERCHANT_PARAM,
  URL_ORDER_ID_PARAM,
} from '@pm-services/http/http.consts';

export const urlParamsChangerInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);

  return combineLatest([
    store.merchant.selectToken(),
    store.order.selectId(),
  ]).pipe(
    switchMap(([token, orderId]) => next(mapReqUrl(req, token, orderId)))
  );
};

function mapReqUrl(
  req: HttpRequest<unknown>,
  merchantToken: string,
  orderId: string
): HttpRequest<unknown> {
  return req.clone({
    url: req.url
      .replace(URL_MERCHANT_PARAM, merchantToken)
      .replace(URL_ORDER_ID_PARAM, orderId),
  });
}
