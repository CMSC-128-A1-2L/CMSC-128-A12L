import { Address } from "@/entities/address";
import { AddressDto } from "@/models/address";

export function mapAddressToAddressDto(address: Address): AddressDto {
    return {
        _id: address._id,
        alumniID: address.alumniID,
        unitNumber: address.unitNumber,
        street: address.street,
        districtMunicipality: address.districtMunicipality,
        city: address.city,
        stateProvince: address.stateProvince,
        country: address.country
    };
}


export function mapAddressDtoToAddress(addressDto: AddressDto): Address {
    return {
        _id: addressDto._id,
        alumniID: addressDto.alumniID,
        unitNumber: addressDto.unitNumber,
        street: addressDto.street,
        districtMunicipality: addressDto.districtMunicipality,
        city: addressDto.city,
        stateProvince: addressDto.stateProvince,
        country: addressDto.country
    };
} 