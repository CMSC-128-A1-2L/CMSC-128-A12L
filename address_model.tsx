import mongoose, { Schema, Document, model } from 'mongoose';

// ref: https://mongoosejs.com/docs/typescript.html

// address interface 

interface IAddress extends Document {
  addressId: mongoose.Types.ObjectId; //pkey, required
  alumniID?: mongoose.Types.ObjectId; // fkey
  unitNumber?: string;
  street?: string;
  districtMunicipality?: string;
  city?: string;
  stateProvince?: string;
  country: string; //required
}

// address schema 
const AddressSchema = new Schema<IAddress>(
  {
    addressId: { type: Schema.Types.ObjectId, required: true, unique: true, auto: true },
    alumniID: { type: Schema.Types.ObjectId, ref: 'Alumni' },
    unitNumber: { type: String},
    street: { type: String },
    districtMunicipality: { type: String},
    city: { type: String},
    stateProvince: { type: String},
    country: { type: String, required: true },
  },

);


// address model
const Address = model<IAddress>('Address', AddressSchema);

export default Address;
