import { jwtDecode } from "jwt-decode";

export const isTokenValid = (Token: string | null): boolean => {
  if (!Token) return false;

  try {
    const decoded = jwtDecode<{ exp: number }>(Token);
    const currentTime = Date.now() / 1000;

    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};


export const decodeToken = (Token: string): any => {
  return jwtDecode(Token);
};