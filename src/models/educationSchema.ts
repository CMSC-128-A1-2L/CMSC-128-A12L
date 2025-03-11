import mongoose, { Schema, Document, model, Types} from "mongoose";


enum EducationLevel {
  PRIMARY,
  SECONDARY,
  TERTIARY
}

interface IEducation extends Document {
  userID: Types.ObjectId,
  schoolName: string,
  startDate: Date,
  endDate?: Date,
  educLevel?: EducationLevel,
  course?: string,
}

const EducationSchema = new Schema<IEducation>(
  {
    userID: { type: Schema.Types.ObjectId, required: true},
    schoolName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: String },
    educLevel: { type: String },
    course: { type: String },
  },
  {
    timestamps: true
  },
)

//  Opportunities model
const Education = model<IEducation>('Education', EducationSchema);


export default EducationSchema;