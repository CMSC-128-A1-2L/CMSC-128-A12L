import mongoose, { Schema, Document, Model, Types} from "mongoose";


enum UserRole {
  ADMIN,
  ALUMNI,
  ALUMNIADMIN
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
  return /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/.test(url);
}

function isValidContactNumber(number: string): boolean {
  return false;
}


interface IUser extends Document {
  role: UserRole,
  studentId?: number,
  firstName: string,
  middleName: string,
  lastName: string,
  suffix?: NameSuffixes,
  gender: Gender,
  currentAddress: Types.ObjectId,
  bio: string,
  linkedIn: string,
  contactNumbers: number[]
}

const UserSchema = new Schema<IUser>(
  {
    role: { type: Number, required: true},
    studentId: { type: Number },
    firstName: { type: String, required: true },
    middleName: { type: String },
    lastName: { type: String, required: true },
    suffix: { type: String },
    currentAddress: { type: Types.ObjectId },
    bio : { type: String },
    linkedIn: { type: String },
    contactNumbers : { type: [String] }

  }
)

export default UserSchema;