export interface MerchantDTO {
  name: string;

  /** Ссылка на логотип */
  logo?: string;

  token: string;
  returnUrls: {
    success?: string;
    failed?: string;
    default: string;
  };
}
