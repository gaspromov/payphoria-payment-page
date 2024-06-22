/** Метод для совершения перевода средств */
export interface PaymentMethodDTO {
  id: string;
  name: string;
  /** Ссылка на картинку-превью метода */
  image: string;

  /** Текст предупреждения */
  warningMessage?: string;
}
