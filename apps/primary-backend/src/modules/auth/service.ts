import { db } from "db";
import { AuthModel } from "./model";

export abstract class Auth {
  static async signUp({
    email,
    password,
  }: AuthModel["signUpBody"]): Promise<string> {
    const user = await db.user.create({
      data: {
        email,
        password: await Bun.password.hash(password),
      },
    });

    return user.id;
  }

  static async signIn({ email, password }: AuthModel["signInBody"]): Promise<{
    correctCredentials: boolean;
    userId?: string;
  }> {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) return { correctCredentials: false };

    if (!(await Bun.password.verify(password, user.password)))
      return { correctCredentials: false };

    return { correctCredentials: true, userId: user.id };
  }

  static async getUserDetails(id: string) {
    return db.user.findFirst({
      where: {
        id,
      },
      select: {
        credits: true,
      },
    });
  }
}
