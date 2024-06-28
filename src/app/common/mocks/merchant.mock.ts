import { MerchantDTO } from '@pm-models/merchant.models';

export const MERCHANT_MOCK = {
  id: 15,
  name: 'i_merch12rub',
  returnUrls: {
    fail: 'https://localhost/fail',
    success: 'https://localhost/success',
  },
  token: '3b7399a62e0840108ff4161773368cdb',
} as unknown as MerchantDTO;
