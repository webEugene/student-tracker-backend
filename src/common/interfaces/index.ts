export interface IRoles {
  value: string;
  description: string;
}

export interface IGenerateToken {
  userInfo: {
    id: string;
    name: string;
    surname: string;
    roles: IRoles[];
    company_id: string;
    type_tariff: number;
    tariff_permission: number;
  };
  access_token: string;
}

export interface IForgetPasswordPayload {
  id: string;
  email: string;
  company_id: string;
}

export interface IGenerateTokenPayload extends IForgetPasswordPayload {
  roles: IRoles[];
}

export interface IMailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}
