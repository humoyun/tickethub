import argon2 from "argon2";

export class Password {
  static async verify(real: string, toCheck: string): Promise<boolean | undefined>  { 
    let bool: boolean | undefined;
    try {
      bool = await argon2.verify(real, toCheck)
    } catch (err) {
      console.error(err)
    }

    return bool;
  }

  static async toHash(plainPassword: string): Promise<string | undefined> {
    let hashedPassword: string | undefined;

    try {
      hashedPassword = await argon2.hash(plainPassword);
    } catch (err) {
      console.error(err)
    }
    
    return hashedPassword
  }
}