import { Types , Schema} from "mongoose";

export interface AddressDto {
  _id?: string;
  alumniID?: string;
  unitNumber?: string;
  street?: string;
  districtMunicipality?: string;
  city?: string;
  stateProvince?: string;
  country: string;
}

export const AddressSchema = new Schema<AddressDto>({
  alumniID: { type: Types.ObjectId, required: false },
  unitNumber: { type: String, required: false },
  street: { type: String, required: false },
  districtMunicipality: { type: String, required: false },
  city: { type: String, required: false },
  stateProvince: { type: String, required: false },
  country: { type: String, required: true },
});
