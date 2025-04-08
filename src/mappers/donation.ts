import { Donation, DonationPaymentMethod } from "@/entities/donation";
import { DonationDto, DonationPaymentMethodDto } from "@/models/donation";
import { Types } from "mongoose";

export function mapDonationToDonationDto(donation: Donation): DonationDto {
    let paymentMethod: DonationPaymentMethodDto;
    switch (donation.paymentMethod) {
        case DonationPaymentMethod.PAYMAYA:
            paymentMethod = DonationPaymentMethodDto.PAYMAYA;
            break;
        case DonationPaymentMethod.STRIPE:
            paymentMethod = DonationPaymentMethodDto.STRIPE;
            break;
        default:
            paymentMethod = DonationPaymentMethodDto.NONE;
            break;
    }
    
    return {
        _id: new Types.ObjectId(donation.id),
        paymentMethod: paymentMethod,
        userId: donation.userId,
        price: donation.price,
        referenceNumber: donation.referenceNumber,
        createdAt: donation.createdAt,
        completedAt: donation.completedAt,
        updatedAt: donation.updatedAt,
    };
}

export function mapDonationDtoToDonation(donationDto: DonationDto): Donation {
    let paymentMethod: DonationPaymentMethod;

    switch (donationDto.paymentMethod) {
        case DonationPaymentMethodDto.PAYMAYA:
            paymentMethod = DonationPaymentMethod.PAYMAYA;
            break;
        case DonationPaymentMethodDto.STRIPE:
            paymentMethod = DonationPaymentMethod.STRIPE;
            break;
        default:
            console.warn
            paymentMethod = DonationPaymentMethod.NONE;
            break;
    }

    return {
        id: donationDto._id.toString(),
        paymentMethod: paymentMethod,
        userId: donationDto.userId,
        price: donationDto.price,
        referenceNumber: donationDto.referenceNumber,
        createdAt: donationDto.createdAt,
        completedAt: donationDto.completedAt,
        updatedAt: donationDto.updatedAt,
    };
}
