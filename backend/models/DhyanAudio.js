import mongoose from "mongoose";

const DhyanAudioSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, unique: true, min: 1, max: 21 },
    audioUrl: { type: String, required: true },
  },
  { timestamps: true },
);

const DhyanAudio = mongoose.model("DhyanAudio", DhyanAudioSchema);
export default DhyanAudio;
