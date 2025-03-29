import { UserDto, UserRoleDto } from "@/models/user";
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
        role: role
    };

    if (user.emailVerified !== null) {
        userDto.emailVerified = user.emailVerified;
    }

    return userDto;
}

