import mongoose, { Schema, Document, Model, Types} from "mongoose";

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

export interface UserDto {
  // In case of google authentication, we need to store the google id and refresh token.
  // googleId?: string,
  // refreshToken?: string,
  id: string,
  email: string,
  emailVerified?: Date,
  role: number,
  studentId?: string,
  name: string,
  suffix?: string,
  alumniStatus?: string,
  documentUrl?: string,
  // gender: string,
  // currentAddress: string,
  // bio: string,
  // linkedIn: string,
  // contactNumbers: number[],
  // adviser: Types.ObjectId,
}

export const UserSchema = new Schema<UserDto>(
  {
    id: { type: String, required: true },
    role: { type: Number, required: true },
    // googleId: { type: String },
    // refreshToken: { type: String },
    email: { type: String, required: true },
    emailVerified: { type: Date },
    studentId: { type: String },
    name: { type: String, required: true },
    suffix: { type: String },
    alumniStatus: { type: String, enum: AlumniStatus, default: AlumniStatus.PENDING },
    documentUrl: { type: String },
    // currentAddress: { type: String, default: "" },
    // bio : { type: String, default: "" },
    // linkedIn: { type: String, validate: {
    //     validator: isValidLinkedIn,
    //     message: "Invalid LinkedIn contact number."
    //   } 
    // },
    // contactNumbers : {
    //   type: [String],
    //   validate: {
    //     validator: isValidContactNumber,
    //     message: "Invalid contact number."
    //   } 
    // },
    // adviser: { type: Schema.Types.ObjectId }
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
