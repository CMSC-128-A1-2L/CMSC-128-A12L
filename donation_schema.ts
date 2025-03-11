import mongoose, { Schema, Document, model } from 'mongoose';

enum DonationType {
    Goods = "Goods",
    Cash = "Cash",
    Services = "Services",
}
interface IDonation extends Document {
    donationID: mongoose.Types.ObjectId;
    donationName: string;
    desc: string;
    type: DonationType;
    monetaryValue: number;
    donorID: mongoose.Types.ObjectId;
    receiveDate?: Date;
}

const DonationSchema = new Schema<IDonation>(
    {
        donationID: {type: Schema.Types.ObjectId, required: true, unique: true, auto: true},
        donationName: {type: String, required: true},
        desc: {type: String, required: true},
        type: {type: String, enum: Object.values(DonationType), required: true},
        monetaryValue: {type: Number, required: true},
        donorID: {type: Schema.Types.ObjectId, ref: 'Alumni', required: true},
        receiveDate: {type: Date}
    }
)

const Donations = model<IDonation>('Donation', DonationSchema);

export default Donations;
