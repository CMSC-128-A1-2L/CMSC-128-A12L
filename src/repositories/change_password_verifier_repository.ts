import { ChangePasswordVerifier } from "@/entities/change_password_verifier";

export interface ChangePasswordVerifierRepository {
    createVerifier(verifier: ChangePasswordVerifier): Promise<void>;
    getVerifierByUserId(userId: string): Promise<ChangePasswordVerifier | null>;
    deleteVerifier(verifier: ChangePasswordVerifier): Promise<void>;
};

export function getChangePasswordVerifierRepository(): ChangePasswordVerifierRepository
{
    // TODO: Implement with a proper repository
    return {
        async createVerifier(verifier: ChangePasswordVerifier): Promise<void> {
            throw new Error("Not implemented");
        },
        async getVerifierByUserId(userId: string): Promise<ChangePasswordVerifier | null> {
            throw new Error("Not implemented");
        },
        async deleteVerifier(verifier: ChangePasswordVerifier): Promise<void> {
            throw new Error("Not implemented");
        }
    }
}
