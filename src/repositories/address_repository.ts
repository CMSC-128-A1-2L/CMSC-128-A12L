// repositories/address_repository.ts
// FUNCTIONALITIES: 
//get address by ID 
//post addresss by ID (ID would be its alumniID field)
// delete address by ID (delete all documents in the collection with that ID)
// update/edit address by id
//note that alumniID is basically any ObjectID passed in the request header (not necessarily from users) since pwede rin na galing yung address from a specific career, event etc.

import { connectDB } from "@/databases/mongodb";
import { AddressDto, AddressSchema } from "@/models/address";
import { mapAddressDtoToAddress, mapAddressToAddressDto } from "@/mappers/address";
import { Address } from "@/entities/address";
import { Connection, Model } from "mongoose";

/**
 * A repository for managing addresses.
 */
export interface AddressRepository {
    /**
     * Fetches a single address by alumniID.
     * 
     * @param alumniId The alumni ID to fetch the address for.
     */
    getAddressByAlumniId(alumniId: string): Promise<Address | null>;

    /**
     * Adds a new address for a given alumniID.
     * 
     * @param address The address to insert.
     */
    createAddress(address: Address): Promise<string>;

    /**
     * Deletes all address documents by alumniID.
     * 
     * @param alumniId The alumni ID to delete addresses for.
     */
    deleteAddressByAlumniId(alumniId: string): Promise<void>;

    /**
     * Updates an existing address by alumniID.
     * 
     * @param address The updated address object.
     */
    updateAddressByAlumniId(address: Address): Promise<void>;
}

class MongoDBAddressRepository implements AddressRepository {
    private connection: Connection;
    private model: Model<AddressDto>;

    constructor(connection: Connection) {
        this.connection = connection;
        this.model = connection.models["Address"] ?? connection.model("Address", AddressSchema, "addresses");
    }

    async getAddressByAlumniId(alumniId: string): Promise<Address | null> {
        const addressDto = await this.model.findOne({ alumniID: alumniId });
        return addressDto ? mapAddressDtoToAddress(addressDto) : null;
    }

    async createAddress(address: Address): Promise<string> {
        const dto = mapAddressToAddressDto(address);
        const created = await this.model.create(dto);
        return created._id.toString();
    }

    async deleteAddressByAlumniId(alumniId: string): Promise<void> {
        await this.model.deleteMany({ alumniID: alumniId });
    }

    async updateAddressByAlumniId(address: Address): Promise<void> {
        const dto = mapAddressToAddressDto(address);
        await this.model.findOneAndUpdate({ alumniID: dto.alumniID }, dto, { new: true, upsert: false });
    }
}

let addressRepository: AddressRepository | null = null;

export function getAddressRepository(): AddressRepository {
    if (addressRepository !== null) {
        return addressRepository;
    }

    const connection = connectDB();
    addressRepository = new MongoDBAddressRepository(connection);
    return addressRepository;
}
