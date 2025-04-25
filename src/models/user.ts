import mongoose, { Schema, Document, Model, Types} from "mongoose";
import { UserRole } from "@/entities/user";

// function isValidLinkedIn(url: string): boolean {
//   const linkedInRegex = /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/
//   return true || linkedInRegex.test(url);
// }

// TODO: fix for validation for non-Philippines phone and mobile numbers
// export function isValidContactNumber(contactNumbers: string[]): boolean { // Is currently setup for only valid phone numbers
//   const contactNumberRegex = /^(\+63|0)9[0-9]{9}$/;
//   // return contactNumbers.every((number) => {contactNumberRegex.test(number)});
//   // temporarily return all numbers as validated, will be fixed later by @erjoyrobles
//   return contactNumbers.every((number) => true);
// }

export enum UserRoleDto {
  NONE = 0,
  ADMIN = 1 << 0,
  ALUMNI = 1 << 1,
  FACULTY = 1 << 2
};

export enum AlumniStatus {
  PENDING = "pending",
  VERIFIED = "verified",
  REJECTED = "rejected"
}

/**
 * The data model for a user.
 **/
export interface UserDto {
  /**
   * The user's ID.
   **/
  id: string;

  /**
   * The user's name.
   **/
  name: string;

  /**
   * The user's email.
   **/
  email: string;

  /**
   * The user's role.
   **/
  role: number;

  /**
   * The user's status.
   **/
  alumniStatus: AlumniStatus;
  
  /**
   * URL to the user's uploaded document (PDF).
   **/
  documentUrl?: string;

  /**
   * URL to the user's uploaded image.
   **/
  imageUrl?: string;

  /**
   * When the user was created.
   **/
  createdAt?: Date;

  /**
   * When the user was last updated.
   **/
  updatedAt?: Date;

  /**
   * Profile-related fields
   **/
  graduationYear?: number;
  department?: string;
  bio?: string;
  phoneNumber?: string;
  currentLocation?: string;
  currentCompany?: string;
  currentPosition?: string;
  linkedIn?: string;
  website?: string;
}

export const UserSchema = new Schema<UserDto>(
  {
    id: { type: String, required: true },
    role: { type: Number, required: true },
    email: { type: String, required: true },
    alumniStatus: { type: String, enum: AlumniStatus, required: true },
    documentUrl: { type: String },
    imageUrl: { type: String },
    createdAt: { type: Date },
    updatedAt: { type: Date },
    graduationYear: { type: Number },
    department: { type: String },
    bio: { type: String },
    phoneNumber: { type: String },
    currentLocation: { type: String },
    currentCompany: { type: String },
    currentPosition: { type: String },
    linkedIn: { type: String },
    website: { type: String },
  },
  {
    timestamps: true,
  },
)

/*
Source: https://stackoverflow.com/questions/76724544/overwritemodelerror-cannot-overwrite-model-once-compiled-in-nextjs-and-typescri
Sometimes, the server sends an error saying "Cannot overwrite 'indicated' model once compiled".
By adding this line 'mongoose.models.'indicated_model', we can avoid this error as sometimes it instantiates another mongoose model when Next.js is 'hot-reloading'
*/
// const UserModel: Model<IUser> = mongoose.models.Users || mongoose.model<IUser>("Users", UserSchema);

// export {
//   UserModel,
//   UserRole,
//   SortBy
// };

// export type { IUser, IUserRequest };
