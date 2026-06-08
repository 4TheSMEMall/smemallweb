import jwt from "jsonwebtoken";

/**
 * Generates a short-lived signed token the BHC app can verify.
 * BHC reads this from the URL, verifies the signature, and pre-fills
 * the email field — the user never has to type their email.
 *
 * Token is signed with the same BHC_WEBHOOK_SECRET both apps share,
 * so no new secret is needed.
 */
export class GenerateBhcLaunchTokenUseCase {
  constructor(private readonly secret: string) {}

  execute(userId: string, email: string): string {
    return jwt.sign(
      {
        sub:    userId,
        email,
        source: "sme-mall",   // BHC can use this to know where the user came from
      },
      this.secret,
      { expiresIn: "30m" }    // 30 minutes — plenty of time to complete the test
    );
  }
}
