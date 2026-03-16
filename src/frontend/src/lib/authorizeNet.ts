export const AUTHNET_LOGIN_ID = "9JQ6vkk8W3DA";
export const AUTHNET_TRANSACTION_KEY = "6S496Y8p9nq8RbGy";
export const AUTHNET_API_URL = "https://api.authorize.net/xml/v1/request.api";

export interface AuthNetBankPaymentParams {
  amountDollars: string;
  routingNumber: string;
  accountNumber: string;
  nameOnAccount: string;
  accountType: "checking" | "savings";
  description?: string;
}

export interface AuthNetResponse {
  transactionResponse?: {
    responseCode: string;
    authCode: string;
    transId: string;
    messages?: { message?: Array<{ code: string; description: string }> };
    errors?: { error?: Array<{ errorCode: string; errorText: string }> };
  };
  messages?: {
    resultCode: string;
    message?: Array<{ code: string; text: string }>;
  };
}

export async function createAuthNetECheckTransaction(
  params: AuthNetBankPaymentParams,
): Promise<AuthNetResponse> {
  const payload = {
    createTransactionRequest: {
      merchantAuthentication: {
        name: AUTHNET_LOGIN_ID,
        transactionKey: AUTHNET_TRANSACTION_KEY,
      },
      transactionRequest: {
        transactionType: "authCaptureTransaction",
        amount: params.amountDollars,
        payment: {
          bankAccount: {
            accountType: params.accountType,
            routingNumber: params.routingNumber,
            accountNumber: params.accountNumber,
            nameOnAccount: params.nameOnAccount,
            echeckType: "WEB",
          },
        },
        order: {
          description: params.description || "ANC Marketplace Payment",
        },
      },
    },
  };

  const response = await fetch(AUTHNET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Authorize.net API error: ${response.status}`);
  }

  const text = await response.text();
  const cleaned = text.replace(/^\uFEFF/, "");
  return JSON.parse(cleaned) as AuthNetResponse;
}
