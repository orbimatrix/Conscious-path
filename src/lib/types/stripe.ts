import Stripe from 'stripe';

export interface StripeCustomer {
  id: string;
  email: string | null;
  name: string | null;
  phone: string | null;
  address: Stripe.Address | null;
}

export interface StripePaymentMethod {
  id: string;
  type: string;
  card: {
    brand: string;
    last4: string;
    expMonth: number;
    expYear: number;
  } | null;
}

export interface StripePayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  customer: StripeCustomer | null;
  paymentMethod: StripePaymentMethod | null;
  metadata: Stripe.Metadata;
  description: string | null;
  receiptEmail: string | null;
}

export interface StripeTransactionsResponse {
  payments: StripePayment[];
  hasMore: boolean;
  totalCount: number;
  pagination: {
    startingAfter: string | undefined;
    endingBefore: string | undefined;
  };
}
