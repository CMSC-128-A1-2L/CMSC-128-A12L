import { Types , Schema} from "mongoose";

export interface CareerDto {
  _id?: string;
  alumniID?: string;
  company: string;
  address?: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  tags?: string[];
}

export const CareerSchema = new Schema<CareerDto>({
  alumniID: { type: Types.ObjectId, required: false },
  company: { type: String, required: true },
  address: { type: String, required: false },
  position: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: false },
  tags: [{ type: String,  required: true }]
});
