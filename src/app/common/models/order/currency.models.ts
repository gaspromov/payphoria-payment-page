/** Валюта */
export interface CurrencyDTO {
  id: string;

  /** Название на русском */
  name: string;

  symbol: string;

  /** Код валюты по стандарту ISO 4217 */
  code: string;
}
