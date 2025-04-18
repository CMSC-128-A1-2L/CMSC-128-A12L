import { ChangePasswordVerifier } from "@/entities/change_password_verifier";

export interface ChangePasswordVerifierRepository {
    createVerifier(verifier: ChangePasswordVerifier): Promise<void>;
    getVerifierByUserId(userId: string): Promise<ChangePasswordVerifier | null>;
    deleteVerifier(verifier: ChangePasswordVerifier): Promise<void>;
};