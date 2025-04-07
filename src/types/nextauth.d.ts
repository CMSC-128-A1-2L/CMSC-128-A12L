import NextAuth, { Session, User } from 'next-auth'
import { UserRole } from '../models/user';

declare module "next-auth" {
    interface User {
        name: string;
        email: string;
        role: UserRole[];
    }
    interface Session {
        user: {
            id: string;
            role: UserRole[];
            email: string;
            accessToken: string;
        }
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        provider?: string;
        accessToken?: string;
        role?: UserRole[];
        // currently being used for logging
        name?: string;
        imageUrl?: string;
    }
}
