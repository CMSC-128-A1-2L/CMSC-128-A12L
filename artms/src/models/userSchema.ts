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
  const linkedInRegex = /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9-]+\/?$/
  return linkedInRegex.test(url);
}

export function isValidContactNumber(number: string): boolean { // Is currently setup for only valid phone numbers
  const contactNumberRegex = /^(\+63|0)9[0-9]{9}$/;
  return contactNumberRegex.test(number);
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

    }
  },
  {
    timestamps: true
  },
)

export default UserSchema;