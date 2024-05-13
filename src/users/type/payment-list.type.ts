type PaymentList = {
  readonly amount: string;
  readonly currency: string;
  readonly status: number;
  readonly plan: number;
  readonly tariff_start_date: string;
  readonly tariff_end_date: string;
};

export default PaymentList;
