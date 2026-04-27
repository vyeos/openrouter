import Elysia, { Cookie } from "elysia";
import { jwt } from "@elysia/jwt";
import { Auth } from "./service";
import { AuthModel } from "./model";

export const AuthApp = new Elysia({ prefix: "/auth" })
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET || "Fischl von Luftschloss Narfidort",
    }),
  )
  .post(
    "/sign-up",
    async ({ body, status }) => {
      try {
        await Auth.signUp(body);
        return status(200, {
          message: "Signed Up Successfully",
        });
      } catch (e) {
        console.error(e);
        return status(400, {
          message: "Error while signing up",
        });
      }
    },
    {
      body: AuthModel.signUpBody,
      response: {
        200: AuthModel.signUpResponse,
        400: AuthModel.signUpFailure,
      },
    },
  )

  .post(
    "/sign-in",
    async ({ jwt, body, status, cookie: { auth } }) => {
      const { correctCredentials, userId } = await Auth.signIn(body);
      if (correctCredentials && userId) {
        const token = await jwt.sign({ userId });
        if (!auth) auth = new Cookie("auth", {});
        auth.set({ value: token, httpOnly: true, maxAge: 7 * 86400 });
        return status(200, { message: "Signed In Successfully" });
      } else {
        return status(403, {
          message: "Invalid credentials",
        });
      }
    },
    {
      body: AuthModel.signInBody,
      response: {
        200: AuthModel.signInResponse,
        403: AuthModel.signInFailure,
      },
    },
  )

  .resolve(async ({ cookie: { auth }, status, jwt }) => {
    if (!auth) return status(401);

    const decoded = await jwt.verify(auth.value as string);
    if (!decoded || !decoded.userId) return status(401);

    return { userId: decoded.userId as string };
  })

  .get(
    "/profile",
    async ({ userId, status }) => {
      const userData = await Auth.getUserDetails(userId);
      if (!userData)
        return status(400, { message: "Error while fetching user details" });
      return userData;
    },
    {
      response: {
        200: AuthModel.profileResponse,
        400: AuthModel.profileFailure,
      },
    },
  );
