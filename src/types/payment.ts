export interface MpesaPaymentPayload {
  orderId: string;
  paymentType: string;
}

export interface MpesaPaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

export interface PaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}
