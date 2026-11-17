import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name is too long"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      match: [/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"],
    },
    email: {
      type: String,
      default: "",
      trim: true,
      lowercase: true,
      maxlength: [120, "Email is too long"],
    },
    description: {
      type: String,
      required: [true, "Message is required"],
      minlength: [10, "Message must be at least 10 characters"],
      maxlength: [1000, "Message is too long"],
      trim: true,
    },
    // "booking" = service booking request from the Services page; "contact" = Contact-page message
    type: { type: String, enum: ["contact", "booking"], default: "contact" },
    service: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["new", "read", "replied"],
      default: "new",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
