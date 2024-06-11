const path = require("path");
const User = require("../models/user");
const UserProfile = require("../models/userprofile");

module.exports = {
  // Controller to update user profile information
  updateProfile: async (req, res, next) => {
    try {
      const { fullName, phoneNumber, city, country } = req.body;

      // Validation checks for mandatory fields
      if (!fullName || !phoneNumber || !city || !country) {
        return res.status(400).json({
          status: false,
          message: "Please provide fullName, phoneNumber, city, and country",
          data: null,
        });
      }

      // Validation check for full name length
      if (fullName.length > 50) {
        return res.status(400).json({
          status: false,
          message: "Invalid full name length. It must be at most 50 characters.",
          data: null,
        });
      }

      // Validation checks for phone number format and length
      if (phoneNumber) {
        if (!/^\d+$/.test(phoneNumber)) {
          return res.status(400).json({
            status: false,
            message: "Invalid phone number format. It must contain only numeric characters.",
            data: null,
          });
        }

        if (phoneNumber.length < 10 || phoneNumber.length > 12) {
          return res.status(400).json({
            status: false,
            message: "Invalid phone number length. It must be between 10 and 12 characters.",
            data: null,
          });
        }
      }
        // Update profil pengguna di database
        const updatedUserProfile = await UserProfile.findOneAndUpdate(
            { userId: req.user.id }, // Temukan profil pengguna berdasarkan ID pengguna
            { fullName, phoneNumber, city, country }, // Perbarui data profil pengguna
            { new: true } // Mengembalikan dokumen yang diperbarui
        );


      if (!updatedUserProfile) {
        return res.status(404).json({
          status: false,
          message: "User not found",
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully",
        data: { updatedUserProfile },
      });
    } catch (err) {
      next(err);
    }
  },
};
