/**
 * The application layer defines what it NEEDS — it doesn't care
 * whether bcrypt, argon2, or anything else does the hashing.
 */
export interface IPasswordService {
  hash(plain: string): Promise<string>;
  compare(plain: string, hash: string): Promise<boolean>;
}
