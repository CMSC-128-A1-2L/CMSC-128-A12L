import { Donation } from "@/entities/donation";
import { DonationDto } from "@/models/donation";

// -- Implemented by Caleb Castro

export function mapDonationToDonationDto(donation: Donation): DonationDto {
    return {
        _id: donation._id,
        donationName: donation.donationName,
        description: donation.description,
        type: donation.type,
        monetaryValue: donation.monetaryValue,
        donorID: donation.donorID,
        receiveDate: donation.receiveDate
    };
}

export function mapDonationDtoToDonation(donationDto: DonationDto): Donation {
    return {
        _id: donationDto._id,
        donationName: donationDto.donationName,
        description: donationDto.description,
        type: donationDto.type,
        monetaryValue: donationDto.monetaryValue,
        donorID: donationDto.donorID,
        receiveDate: donationDto.receiveDate
    };
} 