import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    reflection: { type: String, default: "" },
    text: { type: String, required: true },
    reference: { type: String, required: true },
    isActive: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Quote = mongoose.model("Quote", QuoteSchema);
export default Quote;
