import jwt from "@elysia/jwt";
import Elysia from "elysia";
import { PaymentsModel } from "./model";
import { PaymentsService } from "./service";

export const PaymentsApp = new Elysia({ prefix: "payments" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "Fischl von Luftschloss Narfidort",
    }),
  )
  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    if (!auth) {
      return status(401);
    }

    const decoded = await jwt.verify(auth.value as string);

    if (!decoded || !decoded.userId) {
      return status(401);
    }

    return {
      userId: decoded.userId as string,
    };
  })
  .post(
    "/onramp",
    async ({ userId, status }) => {
      const credits = await PaymentsService.onramp(userId);
      try {
        return status(200, { message: "Onramp successful", credits });
      } catch (e) {
        console.error(e);
        return status(411, {
          message: "Onramp failed",
        });
      }
    },
    {
      response: {
        200: PaymentsModel.onrampResponse,
        411: PaymentsModel.onrampFailure,
      },
    },
  );
