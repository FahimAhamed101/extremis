declare module "jsonwebtoken" {
  export function verify(
    token: string,
    secretOrPublicKey: string,
  ): string | { [key: string]: unknown };
}
