import { OrderDTO } from '@pm-models/order/order.models';

export const TRANSFER_WAITING_ORDER_MOCK = {
  amount: 1000,
  card: 102,
  changedAt: '2024-06-28T15:02:37.745690+00:00',
  createdAt: '2024-06-28T15:02:37.745677+00:00',
  currency: {
    code: 'RUB',
    id: 3,
    name: 'Рубль PAY-IN',
    symbol: '₽',
  },
  expiresAt: '2024-06-28T17:12:37.745677+00:00',
  id: '0667ed08-b72a-72f9-8000-bdc354fac247',
  payment: {
    // bank: 'N/A',
    comment: 'test_comments',
    holderName: 'Магомед Б',
    method: {
      id: '7',
      image: 'https://cdn.gpay.business/images/Sber.png',
      name: 'Sber',
      warningMessage: 'warning message',
    },
    proofImg: '',
    requisites: '2202206831773523',
  },
  status: 'PAYMENT_TRANSFER_WAITING',
  team: 'team14rus',
} as unknown as OrderDTO;
