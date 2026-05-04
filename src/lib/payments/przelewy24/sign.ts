import { createHash } from "crypto";

/**
 * Sumy kontrolne SHA-384 dla REST P24 (konkatenacja JSON jak w dokumentacji / kalkulatorze).
 */
export function signRegister(args: {
  sessionId: string;
  merchantId: number;
  amount: number;
  currency: string;
  crc: string;
}): string {
  const payload = `{"sessionId":"${args.sessionId}","merchantId":${args.merchantId},"amount":${args.amount},"currency":"${args.currency}","crc":"${args.crc}"}`;
  return createHash("sha384").update(payload, "utf8").digest("hex");
}

export function signVerify(args: {
  sessionId: string;
  orderId: number;
  amount: number;
  currency: string;
  crc: string;
}): string {
  const payload = `{"sessionId":"${args.sessionId}","orderId":${args.orderId},"amount":${args.amount},"currency":"${args.currency}","crc":"${args.crc}"}`;
  return createHash("sha384").update(payload, "utf8").digest("hex");
}
