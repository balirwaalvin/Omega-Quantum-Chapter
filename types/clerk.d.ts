export {};

declare global {
  interface CustomJwtSessionClaims {
    email?: string;
    metadata?: {
      role?: "member" | "officer" | "admin";
      deactivated?: boolean;
    };
  }

  interface UserPublicMetadata {
    role?: "member" | "officer" | "admin";
    deactivated?: boolean;
  }
}
