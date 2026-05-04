import { prisma } from "@/lib/db";

export async function logNotificationSent(args: {
  channel: string;
  templateKey?: string;
  toEmail?: string;
  subject?: string;
  bodyPreview?: string;
  meta?: unknown;
}): Promise<void> {
  try {
    await prisma.notificationLog.create({
      data: {
        channel: args.channel.slice(0, 32),
        templateKey: args.templateKey?.slice(0, 80),
        toEmail: args.toEmail?.slice(0, 320),
        subject: args.subject?.slice(0, 500),
        bodyPreview: args.bodyPreview?.slice(0, 600),
        metaJson:
          args.meta === undefined || args.meta === null
            ? null
            : JSON.stringify(args.meta).slice(0, 16_000),
      },
    });
  } catch {
    /* nie blokuj wysyłki */
  }
}
