import bcrypt from "bcryptjs";
import type { IPasswordService } from "../../application/interfaces/IPasswordService";

export class BcryptPasswordService implements IPasswordService {
  private readonly saltRounds = 12;

  async hash(plain: string): Promise<string> {
    return bcrypt.hash(plain, this.saltRounds);
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}
