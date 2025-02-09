const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    diagnosisDate: { type: Date },
    medications: [
      {
        name: { type: String },
        dosage: { type: String },
        frequency: { type: String },
      },
    ],
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
