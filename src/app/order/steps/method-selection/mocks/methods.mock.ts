import { PaymentMethodDTO } from '@pm-models/order/payment-method.models';

export const METHODS_MOCK: PaymentMethodDTO[] = [
  {
    id: 7,
    image: 'https://cdn.gpay.business/images/Sber.png',
    name: 'Sber',
    firstStepDescription:
      'Откройте приложение вашего банка и перейдите в перевод по номеру телефона',
  },
];
