import { UserDto, UserRoleDto, AlumniStatus } from "@/models/user";
import { User, UserRole } from "@/entities/user";
import { Types } from "mongoose";

export function mapUserDtoToUser(userDto: UserDto): User {
    const role: UserRole[] = [];
    if (userDto.role & UserRoleDto.ADMIN) {
        role.push(UserRole.ADMIN);
    }
    if (userDto.role & UserRoleDto.ALUMNI) {
        role.push(UserRole.ALUMNI);
    }
    if (userDto.role & UserRoleDto.FACULTY) {
        role.push(UserRole.FACULTY);
    }

    return {
        id: userDto.id,
        email: userDto.email,
        emailVerified: userDto.emailVerified ?? null,
        name: userDto.name,
        role: role,
        alumniStatus: (userDto.alumniStatus as AlumniStatus) ?? AlumniStatus.PENDING,
        documentUrl: userDto.documentUrl,
        imageUrl: userDto.imageUrl
    }
}

export function mapUserToUserDto(user: User): UserDto {
    let role: UserRoleDto = UserRoleDto.NONE;
    if (user.role?.includes(UserRole.ADMIN)) {
        role |= UserRoleDto.ADMIN;
    }
    if (user.role?.includes(UserRole.ALUMNI)) {
        role |= UserRoleDto.ALUMNI;
    }
    if (user.role?.includes(UserRole.FACULTY)) {
        role |= UserRoleDto.FACULTY;
    }

    const userDto: UserDto = {
        id: user.id,
        email: user.email,
        name: user.name!,
        role: role,
        alumniStatus: user.alumniStatus,
        documentUrl: user.documentUrl,
        imageUrl: user.imageUrl
    };

    if (user.emailVerified !== null) {
        userDto.emailVerified = user.emailVerified;
    }

    if (user.documentUrl) {
        userDto.documentUrl = user.documentUrl;
    }

    if (user.imageUrl) {
        userDto.imageUrl = user.imageUrl;
    }

    return userDto;
}

