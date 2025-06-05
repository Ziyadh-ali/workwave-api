import bcrypt from "bcrypt";
import { IBcrypt } from "./bcrypt.interface";
import { injectable } from "tsyringe";

@injectable()
export class PasswordBcrypt implements IBcrypt {
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password,10);
    }

    async compare(current: string, original: string): Promise<boolean> {
        return bcrypt.compare(current , original);
    }
}