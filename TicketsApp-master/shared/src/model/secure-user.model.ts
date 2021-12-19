export interface SecureUserModel {
    email: string;
    hash: string;
    salt: string;
    token: string;
    generateJWT: () => string;
    validatePassword: (password: string) => boolean;
}
