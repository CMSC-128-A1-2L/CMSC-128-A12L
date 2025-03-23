import NextAuth from 'next-auth'
import { UserRole } from '../models/user';

declare module "next-auth" {
    interface User {
        name: string;
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
