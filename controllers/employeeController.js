import mongoose from "mongoose";
import User from "../models/User.js";
import logAuditAction from "../middleware/auditLogsMiddleware.js";

let profileBucket;
mongoose.connection.once("open", () => {
  profileBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "profile",
  });
});

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    return res.status(200).json({
      message: "success.",
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
}

export const updateProfile = async (req, res) => {
  try {
    const data = { ...req.body }; // Get the user profile data from the request body

    // Check if files are provided in the request
    const files = req.files;

    // Initialize the updatedData object to store file information and user data
    const updatedData = { ...data };

    // If no files are uploaded, update the profile with just the user data
    if (!files || Object.keys(files).length === 0) {
      const result = await User.findByIdAndUpdate(req.user.userId, updatedData, {
        new: true,
        runValidators: true,
      });

      if (!result) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      await logAuditAction(req.user.userId, 'PROFILE UPDATED', 'User Profile', `${result.userName} updated his profile`);
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: result,
      });
    }

    // Handle file uploads (Profile Image, Resume, Aadhar, Pan, Bank documents)
    const handleFileUpload = async (fileField, file) => {
      const uploadStream = profileBucket.openUploadStream(file.originalname);
      uploadStream.end(file.buffer);

      return new Promise((resolve, reject) => {
        uploadStream.on('finish', async () => {
          const fileId = uploadStream.id;
          resolve({ [`${fileField}.image`]: file.originalname, [`${fileField}.imageId`]: fileId });
        });

        uploadStream.on('error', (error) => {
          reject(error);
        });
      });
    };

    // Process each file and update the corresponding field in the user model
    const filePromises = [];

    // Profile Image
    if (files.profileImage) {
      filePromises.push(handleFileUpload('image', files.profileImage[0]));
    }

    // Resume
    if (files.resume) {
      updatedData.resume = files.resume[0].originalname;
    }

    // Aadhar Image
    if (files.aadharImage) {
      filePromises.push(handleFileUpload('aadhaar', files.aadharImage[0]));
    }

    // PAN Image
    if (files.panImage) {
      filePromises.push(handleFileUpload('pan', files.panImage[0]));
    }

    // Bank Image
    if (files.bankImage) {
      filePromises.push(handleFileUpload('bank', files.bankImage[0]));
    }

    // Wait for all file uploads to complete
    const uploadedFiles = await Promise.all(filePromises);

    // Merge the uploaded file information into updatedData
    uploadedFiles.forEach((fileInfo) => {
      Object.assign(updatedData, fileInfo);
    });

    // Update the user profile with all the new data (including file references)
    const result = await User.findByIdAndUpdate(req.user.userId, updatedData, {
      new: true,
      runValidators: true,
    });

    if (!result) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    await logAuditAction(req.user.userId, 'PROFILE UPDATED', 'User Profile', `${result.userName} updated his profile`);

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
};

export const getProfileFile = (req, res) => {
  try {
    const { fileId } = req.params;
    const downloadStream = profileBucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("end", () => {
      res.end();
    });

    downloadStream.on("error", (error) => {
      res.status(404).json({ error: "Image not found" });
    });
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
};

export const removeUser = async (req,res) => {
  try {
    const {id} = req.params
    const result = await User.findByIdAndDelete(id)
    if(!result){
      return res.status(404).json({ message: 'remove user failed'})
    }
    await logAuditAction(req.user.userId, 'USER REMOVED', 'User Management', `${result.userName} removed by admin`);

    return res.status(200).json({ message: 'remove user success'})
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
}

export const roleChange = async (req,res) => {
  try {
    const {id} = req.params;
    const {role} = req.body;
    const result = await User.findByIdAndUpdate(id,{role}, {
      new: true,
      runValidators: true,
    })
    if(!result){
      return res.status(404).json({ message: 'update user failed'});
    }
    await logAuditAction(req.user.userId, 'USER ROLE CHANGED', 'User Management', `${result.userName} Role changed to ${role}.`);

    return res.status(200).json({ message: 'role changed success'});
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
}

export const getAllUser = async (req,res) => {
  try {
    const result = await User.find({})
    return res.status(200).json({ message: 'success',data:result})
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
}

export const getOneUser = async (req,res) => {
  try {
    const {id} = req.params
    const result = await User.findById(id)
    return res.status(200).json({ message: 'success',data:result})
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error',error:error.message})
  }
}