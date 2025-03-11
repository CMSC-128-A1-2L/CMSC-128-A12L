import mongoose, { Schema, Document, model } from 'mongoose';

// ref: https://mongoosejs.com/docs/typescript.html
// enum for  positions
enum Position {
  Intern = 'Intern',
  SoftwareDeveloper = 'Software Developer',
  DevOps = 'DevOps',
  DataScientist = 'Data Scientist',
  ProjectManager = 'Project Manager',
  UXDesigner = 'UX Designer',
  Other = 'Other',
}

// career interface
interface ICareer extends Document {
  careerID: mongoose.Types.ObjectId; //pkey
 alumniID?: mongoose.Types.ObjectId; // fkey
  company: string;
  address?: mongoose.Types.ObjectId; // fkey
  position: Position;
  startDate: Date;
  endDate?: Date;
  tags?: string[];
}

//  career Schema
const CareerSchema = new Schema<ICareer>(
  {
    careerID: { type: Schema.Types.ObjectId, required: true, unique: true, auto: true },
    alumniID: { type: Schema.Types.ObjectId, ref: 'Alumni' },
    company: { type: String, required: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address' },
    position: { type: String, enum: Object.values(Position), required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    tags: { type: [String], default: [] },
  }
  , {timestamps: true}

);





//  career model
const Career = model<ICareer>('Career', CareerSchema);

export default Career;
