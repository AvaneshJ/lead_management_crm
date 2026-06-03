const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"], trim: true },
  email: {
    type: String,
    required: [true, "Email is required"],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true,
    match: [
      /^\+?[0-9\s\-]{7,15}$/,
      "Please fill a valid phone number (7 to 15 digits, spaces or dashes allowed)",
    ],
  },
  company: {
    type: String,
    required: [true, "Company is required"],
    trim: true,
  },
  status: {
    type: String,
    enum: ["New", "Contacted", "Qualified", "Converted", "Lost"],
    default: "New",
  },
  notes: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LeadSchema.index({ name: "text", email: "text", company: "text" });

module.exports = mongoose.model("Lead", LeadSchema);
