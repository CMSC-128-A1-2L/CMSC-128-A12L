import mongoose, { Schema, Document, model } from 'mongoose';

interface IEvent extends Document {
    eventID: mongoose.Types.ObjectId;
    eventName: string;
    desc: string;
    type: string;
    monetaryValue: number;
    adminID: mongoose.Types.ObjectId;
    wouldGo: mongoose.Types.ObjectId[];
    wouldNotGo: mongoose.Types.ObjectId[];
    wouldMaybeGo: mongoose.Types.ObjectId[];
}

const EventSchema = new Schema<IEvent>(
    {
        eventID: {type: Schema.Types.ObjectId, required: true, unique: true, auto: true},
        eventName: {type: String, required: true},
        desc: {type: String, required: true},
        type: {type: String, required: true},
        monetaryValue: {type: Number, required: true},
        adminID: {type: Schema.Types.ObjectId, ref: 'Alumni', required: true},
        wouldGo: {type: [Schema.Types.ObjectId], required: true},
        wouldNotGo: {type: [Schema.Types.ObjectId], required: true},
        wouldMaybeGo: {type: [Schema.Types.ObjectId], required: true},
    }
)

const Events = model<IEvent>('Event', EventSchema);

export default Events;