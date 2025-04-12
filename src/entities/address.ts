// entities/address

export interface Address {
  _id?: string;//pkey, required
  alumniID?: string; // fkey
  unitNumber?: string; 
  street?: string; 
  districtMunicipality?: string;
  city?: string;
  stateProvince?: string;
  country: string; //required
}