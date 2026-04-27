import { t, UnwrapSchema } from "elysia";

export const AuthModel = {
  signInBody: t.Object({
    email: t.String(),
    password: t.String(),
  }),
  signInResponse: t.Object({
    message: t.Literal("Signed In Successfully"),
  }),
  signInFailure: t.Object({ message: t.Literal("Invalid credentials") }),
  signUpBody: t.Object({
    email: t.String(),
    password: t.String(),
  }),
  signUpResponse: t.Object({
    message: t.Literal("Signed Up Successfully"),
  }),
  signUpFailure: t.Object({
    message:
      t.Literal("Error while signing up") || t.Literal("User already exists"),
  }),
  profileResponse: t.Object({
    credits: t.Number(),
  }),
  profileFailure: t.Object({
    message: t.Literal("Error while fetching user details"),
  }),
};

export type AuthModel = {
  [k in keyof typeof AuthModel]: UnwrapSchema<(typeof AuthModel)[k]>;
};
