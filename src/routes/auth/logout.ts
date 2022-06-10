import type { RequestEvent } from "@sveltejs/kit";

import bcrypt from "bcryptjs";
import jwt from "$lib/auth/jwt";
import { db } from "$lib/db/db";
import { serialize } from "cookie";

export const get = async ({ locals }: RequestEvent) => {
  if (locals && locals.user) {
    return {
      status: 302,
      headers: {
        'Set-Cookie': serialize('access_token', '', {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production',
          expires: new Date(0)
        }),
        location: '/'
      }
    };
  }
  return {
  }
}

export const post = async ({ request }: RequestEvent) => {
  try {
    const submittedData = await request.formData();
    const email = submittedData.get('email');
    const password = submittedData.get('password') + "";
    const user = await db.user.findUnique({
      where: {
        email
      }, select: {
        name: true,
        email: true,
        role: true,
        password: true,
        id: true
      }
    });
    if (!user) {
      throw new Error("User not found");
    }
    const checkPassword = bcrypt.compareSync(password, user.password)
    if (!checkPassword) throw new Error('Email address or password not valid')
    delete user.password
    const accessToken = await jwt.signAccessToken(user);
    return {
      status: 302,
      headers: {
        'Set-Cookie': serialize('access_token', accessToken, {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        }),
        location: '/'
      }
    };
  } catch (error) {
    console.error(error);
  } finally {
    db.$disconnect();
  }
}