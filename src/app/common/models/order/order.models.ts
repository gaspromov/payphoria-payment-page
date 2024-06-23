import { BankDTO } from './bank.models';
import { CurrencyDTO } from './currency.models';
import { PaymentMethodDTO } from './payment-method.models';

/** Данные заказа */
export interface OrderDTO {
  id: string;
  /** Сумма заказа */
  amount: number;

  /** Валюта заказа */
  currency: CurrencyDTO;

  /** Дата создания */
  createdAt: number;
  /** Дата последнего изменения */
  updatedAt: number;

  /**
   * Дата просрочки заказа.
   *
   * Появляется на статусах PAYMENT_TRANSFER_WAITING и PAYMENT_APPROVE_WAITING
   **/
  expiresAt?: number;

  /** Текущий статус */
  status: OrderStatuses;

  /** Данные для совершения перевода средств. Появляется после статуса PAYMENT_METHOD_WAITING */
  payment?: OrderPaymentDTO;
}

export enum OrderStatuses {
  /** Пользователь должен выбрать метод оплаты. */
  PAYMENT_METHOD_SELECTION = 'PAYMENT_METHOD_SELECTION',

  /** Ожидание установки PaymentData для ордера. Автопереход к следующему статусу. */
  PAYMENT_METHOD_WAITING = 'PAYMENT_METHOD_WAITING',

  /** Ожидание подтверждения перевода средств от пользователя. */
  PAYMENT_TRANSFER_WAITING = 'PAYMENT_TRANSFER_WAITING',

  /** Ожидание подтверждения перевода средств от системы. Автопереход к следующему статусу. */
  PAYMENT_APPROVE_WAITING = 'PAYMENT_APPROVE_WAITING',

  /** Конечный стейт. Успешо исполненный заказ. */
  SUCCESS = 'SUCCESS',

  /** Конечный стейт. Отмененный заказ. */
  CANCELED = 'CANCELED',

  /** Конечный стейт. Неуспешный заказ. */
  FAILED = 'FAILED',
}

export interface OrderPaymentDTO {
  method: PaymentMethodDTO;
  bank: BankDTO;
  requisites: string;
  holderName: string;
  comment?: string;
  /** Чек, подтверждающий перевод */
  proofImg?: string;
}
