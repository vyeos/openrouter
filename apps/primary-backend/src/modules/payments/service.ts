import { db } from "db";

const ONRAMP_AMOUNT = 1000;
export abstract class PaymentsService {
  static async onramp(userId: string) {
    const [user] = await db.$transaction([
      db.user.update({
        where: { id: userId },
        data: { credits: { increment: ONRAMP_AMOUNT } },
      }),
      db.onrampTransaction.create({
        data: {
          userId,
          amount: ONRAMP_AMOUNT,
          status: "completed",
        },
      }),
    ]);

    return user.credits;
  }
}
