import mongoose from "mongoose";

const MantraAudioSchema = new mongoose.Schema(
  {
    day: { type: Number, required: true, unique: true, min: 1, max: 108 },
    audioUrl: { type: String, required: true },
  },
  { timestamps: true },
);

const MantraAudio = mongoose.model("MantraAudio", MantraAudioSchema);
export default MantraAudio;
