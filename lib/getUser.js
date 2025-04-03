import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
export async function getUserFromCookie() {
  const cookie = (await cookies()).get("crud")?.value;

  if (cookie) {
    try {
      const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
      return decoded;
    } catch (err) {
      return null;
    }
  }
}
