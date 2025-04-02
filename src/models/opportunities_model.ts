import mongoose, { Schema, Document, model, Types} from "mongoose";


enum WorkMode {
  REMOTE,
  ONSITE,
  HYRBID
}

interface IOpportunities extends Document {
  userID: Types.ObjectId,
  title: string,
  description: string,
  position: string,
  company: string,
  location?: Types.ObjectId,
  tags: string[],
  workMode?: WorkMode,
}

const OpportunitiesSchema = new Schema<IOpportunities>(
  {
    userID: { type: Schema.Types.ObjectId, required: true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    position: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: Schema.Types.ObjectId },
    tags : { type: [String] },
    workMode: {type: String},
  },
  {
    timestamps: true
  },
)

//  Opportunities model
const Opportunities = model<IOpportunities>('opportunities', OpportunitiesSchema);

export default Opportunities;