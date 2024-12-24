declare module "next" {
  interface NextApiRequest {
    user?: DecodedToken; // Add user property
  }
}

export interface DecodedToken {
  email: string;
  id: string;
}
