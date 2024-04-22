const { createHash } = require('node:crypto');
import axios from 'axios';
export interface ILiqPayInterface {
  public_key: string;
  private_key: string;
  host: string;
  availableLanguages: string[];
  buttonTranslations: object;
}

export interface IParams {
  action?: string;
  amount?: string | number;
  currency?: string;
  description?: string;
  order_id?: string;
  version?: string | number;
  language?: string;
  public_key?: string;
  result_url?: string;
  server_url?: string;
  data?: string;
  signature?: string;
}

// eslint-disable-next-line no-unused-vars
enum Languages {
  // eslint-disable-next-line no-unused-vars
  UK = 'uk',
  // eslint-disable-next-line no-unused-vars
  EN = 'en',
}

type DecodedDataPaymentType = {
  readonly payment_id: bigint;
  readonly status: string;
  readonly order_id: string;
  readonly liqpay_order_id: string;
  readonly amount: string;
  readonly currency: string;
  readonly end_date: string;
  readonly transaction_id: bigint;
  readonly signature: string;
  readonly plan: number;
  readonly company_id: string;
};

type CnbObjectType = {
  readonly data: string;
  readonly signature: string;
};

export class LiqPayLib implements ILiqPayInterface {
  public_key: string;
  private_key: string;
  host: string;
  availableLanguages: string[];
  buttonTranslations: object;

  constructor(public_key: string, private_key: string) {
    this.public_key = public_key;
    this.private_key = private_key;
    this.host = 'https://www.liqpay.ua/api/';
    this.availableLanguages = ['uk', 'en'];
    this.buttonTranslations = { uk: 'Сплатити', en: 'Pay' };
  }
  strToSign(str: string): string {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }

    const sha1 = createHash('sha1');
    sha1.update(str);
    return sha1.digest('base64');
  }

  async api(path: string, params: IParams): Promise<any> {
    if (!params.version) {
      throw new Error('version is null');
    }

    params.public_key = this.public_key;

    const data: string = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature: string = this.strToSign(
      `${this.private_key}${data}${this.private_key}`,
    );

    const dataToSend: URLSearchParams = new URLSearchParams();
    dataToSend.append('data', data);
    dataToSend.append('signature', signature);

    // eslint-disable-next-line no-useless-catch
    try {
      const response = await axios.post(this.host + path, dataToSend, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Request failed with status code: ${response.status}`);
      }
    } catch (error) {
      throw error;
    }
  }
  cnbParams(params: IParams) {
    params.public_key = this.public_key;

    // Validate and convert version to number
    if (params.version) {
      if (
        typeof params.version === 'string' &&
        !isNaN(Number(params.version))
      ) {
        params.version = Number(params.version);
      } else if (typeof params.version !== 'number') {
        throw new Error(
          'version must be a number or a string that can be converted to a number',
        );
      }
    } else {
      throw new Error('version is null');
    }

    // Validate and convert amount to number
    if (params.amount) {
      if (typeof params.amount === 'string' && !isNaN(Number(params.amount))) {
        params.amount = Number(params.amount);
      } else if (typeof params.amount !== 'number') {
        throw new Error(
          'amount must be a number or a string that can be converted to a number',
        );
      }
    } else {
      throw new Error('amount is null');
    }

    // Ensure other parameters are strings
    const stringParams: string[] = [
      'action',
      'currency',
      'description',
      'language',
    ];
    for (const param of stringParams) {
      if (params[param] && typeof params[param] !== 'string') {
        params[param] = String(params[param]);
      } else if (!params[param] && param !== 'language') {
        // language is optional
        throw new Error(`${param} is null or not provided`);
      }
    }

    // Check if language is set and is valid
    if (params.language && !this.availableLanguages.includes(params.language)) {
      params.language = Languages.UK;
    }

    return params;
  }

  cnbForm(params: IParams): string {
    let buttonText = this.buttonTranslations[Languages.UK];
    if (params.language) {
      buttonText =
        this.buttonTranslations[params.language] ||
        this.buttonTranslations[Languages.UK];
    }

    params = this.cnbParams(params);
    const data: string = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature: string = this.strToSign(
      `${this.private_key}${data}${this.private_key}`,
    );

    return `
      <form method="POST" action="https://www.liqpay.ua/api/3/checkout" accept-charset="utf-8">
        <input type="hidden" name="data" value="${data}" />
        <input type="hidden" name="signature" value="${signature}" />
        <sdk-button label="${buttonText}" background="#77CC5D" onClick="submit()"></sdk-button>
      </form>
    `;
  }

  cnbSignature(params: IParams): string {
    params = this.cnbParams(params);
    const data: string = Buffer.from(JSON.stringify(params)).toString('base64');
    return this.strToSign(`${this.private_key}${data}${this.private_key}`);
  }

  cnbObject(params: IParams): CnbObjectType {
    params.language = params.language || Languages.UK;
    params = this.cnbParams(params);
    const data: string = Buffer.from(JSON.stringify(params)).toString('base64');
    const signature: string = this.strToSign(
      `${this.private_key}${data}${this.private_key}`,
    );
    return { data: data, signature: signature };
  }

  decodeDataPayment(data: string): DecodedDataPaymentType {
    let buff = Buffer.from(data, 'base64');
    const decodedDataPayment: string = buff.toString('utf-8');
    return JSON.parse(decodedDataPayment);
  }
}
