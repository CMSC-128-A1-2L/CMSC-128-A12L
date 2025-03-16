import mongoose, { Schema, Document, Model, Types} from "mongoose";


enum UserRole {
  ADMIN = "admin",
  ALUMNI = "alumni",
  ALUMNIADMIN = "alumniadmin",
  STUDENT = "student"
}

enum NameSuffixes {
  JR = "Jr.",
  SR = "Sr.",
  THIRD = "III",
  FOURTH = "IV",
}

enum Gender {
  MALE = "Male",
  FEMALE = "Female",
  NONBINARY = "Non-binary"
}

function isValidLinkedIn(url: string): boolean {
  const linkedInRegex = /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/
  return true || linkedInRegex.test(url);
}

// TODO: fix for validation for non-Philippines phone and mobile numbers
export function isValidContactNumber(contactNumbers: string[]): boolean { // Is currently setup for only valid phone numbers
  return true;
  const contactNumberRegex = /^(\+63|0)9[0-9]{9}$/;
  return contactNumbers.every((number) => {contactNumberRegex.test(number)});
}


interface IUser extends Document {
  role: UserRole,
  studentId?: string,
  firstName: string,
  middleName: string,
  lastName: string,
  suffix?: NameSuffixes,
  gender: Gender,
  currentAddress: Types.ObjectId,
  bio: string,
  linkedIn: string,
  contactNumbers: number[],
  adviser: Types.ObjectId,
}

const UserSchema = new Schema<IUser>(
  {
    role: { type: String, required: true},
    studentId: { type: String },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    suffix: { type: String },
    currentAddress: { type: Schema.Types.ObjectId },
    bio : { type: String },
    linkedIn: { type: String, validate: {
        validator: isValidLinkedIn,
        message: "Invalid LinkedIn contact number."
      } 
    },
    contactNumbers : { type: [String], validate: {
      validator: isValidContactNumber,
      message: "Invalid contact number."
    } 
    },
    adviser: { type: Schema.Types.ObjectId}
  },
  {
    timestamps: true
  },
)

const UserModel: Model<IUser> = mongoose.models.Users || mongoose.model<IUser>("Users", UserSchema);

////////////////////////////////////////////////////////////////////////////////////////////////////

enum SortBy {
  NAME = "lastName",
  STUDENT_ID = "studentId",
  DATE_CREATED = "createdAt",
  LAST_ACTIVE = "last_active",
  ADDRESS = "currentAddress"
}
interface IUserRequest extends Partial<IUser>{
  page: number,
  amountPerPage: number,
  sortBy: SortBy,
  sortOrder: ["asc", "desc"]
}

export {
  UserModel,
  SortBy
};
export type { IUser, IUserRequest };
