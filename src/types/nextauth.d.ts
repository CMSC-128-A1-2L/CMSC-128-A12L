import NextAuth from 'next-auth'
import { UserRole } from '../models/user_model';

declare module "next-auth" {
    interface User {
        email: string;
        role: UserRole[];
    }
    interface JWT {
        role: UserRole[];
    }
    interface Session {
        user: {
            role: UserRole[];
            email: string;
            accessToken: string;
        }
    }
}
