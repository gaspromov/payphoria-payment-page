import { URL_ORDER_ID_PARAM } from '@pm-services/http/http.consts';
import { HttpRequestData } from '@pm-services/http/http.models';

const enum CommonRequestNames {
  POST_ORDER = 'POST_ORDER',
  GET_ORDER = 'GET_ORDER',
  NEXT_ORDER = 'NEXT_ORDER',

  GET_MERCHANT = 'GET_MERCHANT',
  GET_PAGE_CONFIG = 'GET_PAGE_CONFIG',
}

export const COMMON_REQUESTS: Record<CommonRequestNames, HttpRequestData> = {
  POST_ORDER: {
    url: '/order',
    method: 'POST',
  },
  GET_ORDER: {
    url: `/order/${URL_ORDER_ID_PARAM}`,
    method: 'GET',
    transferCache: false,
  },
  NEXT_ORDER: {
    url: `/order/${URL_ORDER_ID_PARAM}`,
    method: 'PUT',
  },

  GET_MERCHANT: {
    url: '',
    method: 'GET',
  },

  GET_PAGE_CONFIG: {
    url: '/page-config',
    method: 'GET',
  },
};
