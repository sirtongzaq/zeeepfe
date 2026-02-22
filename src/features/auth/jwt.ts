export interface JwtPayload {
  sub: string;
  exp: number;
  iat: number;
}

export function decodeToken(token: string): JwtPayload {
  return JSON.parse(atob(token.split(".")[1]));
}
