/** Метод для совершения перевода средств */
export interface PaymentMethodDTO {
  id: number;
  name: string;
  /** Ссылка на картинку-превью метода */
  image: string;

  /** Текст предупреждения */
  warningMessage?: string;
  /** Описание первого шага для исполнения платежа */
  firstStepDescription: string
}
