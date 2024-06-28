import { OrderDTO } from '@pm-models/order/order.models';

export const METHOD_WAITING_ORDER_MOCK = {
  amount: 2100,
  card: 0,
  changedAt: '2024-06-28T15:00:50.449066+00:00',
  createdAt: '2024-06-28T15:00:46.782219+00:00',
  currency: {
    code: 'RUB',
    id: 3,
    name: 'Рубль PAY-IN',
    symbol: '₽',
  },
  expiresAt: '2024-06-28T15:10:46.782219+00:00',
  id: '0667ed01-ec6d-7d66-8000-bbc9547839fa',
  payment: {
    method: {
      id: '7',
      image: 'https://cdn.gpay.business/images/Sber.png',
      name: 'Sber',
      warningMessage: 'warning message',
    },
  },
  status: 'PAYMENT_METHOD_WAITING',
  team: 'N/A',
} as unknown as OrderDTO;
