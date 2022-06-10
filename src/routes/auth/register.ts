import type { RequestEvent } from "@sveltejs/kit";

import bcrypt from "bcryptjs";
import jwt from "$lib/auth/jwt";
import { db } from "$lib/db/db";

export const get = async ({ locals }: RequestEvent) => {
  if (locals && locals.user) {
    return {
      status: 302,
      headers: {
        location: '/'
      },
      body: { user: locals }
    }
  }
  if (!process.env.ALLOW_REGISTRATION) {
    return {
      status: 302,
      headers: {
        location: '/login'
      }
    }
  }

  return {};
}

export const post = async ({ request }: RequestEvent) => {
  try {
    if (!process.env.ALLOW_REGISTRATION) {
      return {
        status: 302,
        headers: {
          location: '/login'
        }
      }
    }
    const submittedData = await request.formData();
    const name = submittedData.get('name');
    const email = submittedData.get('email');
    let password = submittedData.get('password') + "";
    password = bcrypt.hashSync(password, 8);
    const data = {
      email,
      name,
      password
    }
    const user = await db.user.create({
      data
    });
    const accessToken = await jwt.signAccessToken(user)
    const returnData = { ...data, accessToken };
    return {
      body: returnData
    };
  } catch (error) {
    console.error(error);
  } finally {
    db.$disconnect();
  }
}