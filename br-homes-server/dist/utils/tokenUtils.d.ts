/**
 * Generate a raw verification token and its SHA-256 hash.
 * Raw token is sent in the email link; hashed token is stored in DB.
 */
export declare const generateVerificationToken: () => {
    rawToken: string;
    hashedToken: string;
};
/**
 * Hash a token using SHA-256. Used to compare incoming tokens against stored hashes.
 */
export declare const hashToken: (token: string) => string;
//# sourceMappingURL=tokenUtils.d.ts.map