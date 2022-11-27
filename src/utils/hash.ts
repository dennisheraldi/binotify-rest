import crypto from "crypto";
export function hashPassword(password2hash: string) {
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
        .pbkdf2Sync(password2hash, salt, 1000, 64, `sha512`)
        .toString(`hex`);
    // concat salt and hash
    const hashedPassword = `${salt}$${hash}`;
    return {
        hashedPassword,
    };
}

export function verifyPassword({
    candidatePassword,
    password,
}: {
    candidatePassword: string;
    password: string;
}) {
    const salthash = password.split("$");
    const salt: string = salthash[0] as string;
    const hash: string = salthash[1] as string;
    const candidateHash = crypto
        .pbkdf2Sync(candidatePassword, salt, 1000, 64, `sha512`)
        .toString(`hex`);
    return candidateHash === hash;
}
