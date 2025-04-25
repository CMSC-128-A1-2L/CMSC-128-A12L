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
        imageUrl: userDto.imageUrl,
        createdAt: userDto.createdAt,
        updatedAt: userDto.updatedAt,
        graduationYear: userDto.graduationYear,
        department: userDto.department,
        bio: userDto.bio,
        phoneNumber: userDto.phoneNumber,
        currentLocation: userDto.currentLocation,
        currentCompany: userDto.currentCompany,
        currentPosition: userDto.currentPosition,
        linkedIn: userDto.linkedIn,
        website: userDto.website
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
        imageUrl: user.imageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        graduationYear: user.graduationYear,
        department: user.department,
        bio: user.bio,
        phoneNumber: user.phoneNumber,
        currentLocation: user.currentLocation,
        currentCompany: user.currentCompany,
        currentPosition: user.currentPosition,
        linkedIn: user.linkedIn,
        website: user.website
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

