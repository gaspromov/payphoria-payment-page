import { HttpRequestData } from '@pm-services/http/http.models';

export const GET_METHOD_SELECTION_REQ: HttpRequestData = {
  url: '/methods',
  method: 'GET',
};

export const GET_HMAC_HASH_REQ: HttpRequestData = {
  url: '/sign',
  method: 'POST',
};
