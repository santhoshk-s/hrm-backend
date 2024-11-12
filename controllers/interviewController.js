import mongoose from "mongoose";
import Interviews from "../models/interviewModal.js";

let interviewBucket;
mongoose.connection.once("open", () => {
    interviewBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "interviewImage",
    });
});

export const addInterview = async (req, res) => {
    try {
        const data = { ...req.body };
        if (!req.file) {
            const newData = new Interviews({ ...data })
            await newData.save();
            return res.status(201).json({ message: "added new data" })
        }
        const uploadStream = interviewBucket.openUploadStream(req.file.originalname);
        uploadStream.end(req.file.buffer);

        uploadStream.on("finish", async () => {
            const newData = new Interviews({
                resume: req.file.originalname,
                resumeId: uploadStream.id,
                ...data
            });

            const result = await newData.save();
            return res
                .status(201)
                .json({ message: "new data created", data: result });
        });

        uploadStream.on("error", (error) => {
            return res.status(500).json({ message: "file upload failed , try again", error: error.message });
        });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ message: "internal server error", error: error.message })
    }
};

export const updateInterview = async (req, res) => {
    try {
        const { id } = req.params;
        const data = { ...req.body };
        if (!req.file) {
            const result = await Interviews.findByIdAndUpdate(id, data, {
                new: true,
                runValidators: true,
            });

            if (!result) {
                return res.status(404).json({ success: false, message: "data not found" });
            }
            return res
                .status(200)
                .json({ success: true, message: "Update successful", data: result });
        }
        const uploadStream = interviewBucket.openUploadStream(req.file.originalname);
        uploadStream.end(req.file.buffer);

        uploadStream.on("finish", async () => {
            const resumeId = uploadStream.id;
            const updatedData = { resume: req.file.originalname, resumeId, ...data };

            const result = await Interviews.findByIdAndUpdate(id, updatedData, {
                new: true,
                runValidators: true,
            });

            if (!result) {
                return res.status(404).json({ success: false, message: "data not found" });
            }
            return res
                .status(200)
                .json({ success: true, message: "Update successful", data: result });
        });

        uploadStream.on("error", (error) => {
            return res
                .status(500)
                .json({ message: "File upload failed", error: error.message });
        });
    } catch (error) {
        return res.status(500).json({ message: "internal server error", error: error.message })
    }
};

export const getAllInterviews = async (req,res) => {
    try {
        const result = await Interviews.find({})
        return res.status(200).json({ message: "success", data:result })
    } catch (error) {
        return res.status(500).json({ message: "internal server error", error: error.message })
    }
};

export const getOneInterviews = async (req,res) => {
    try {
        const {id} = req.params
        const result = await Interviews.findById(id)
        return res.status(200).json({ message: "success", data:result })
    } catch (error) {
        return res.status(500).json({ message: "internal server error", error: error.message })
    }
};

export const getInterviewFile = (req, res) => {
    try {
        const { resumeId } = req.params;
        const downloadStream = interviewBucket.openDownloadStream(new mongoose.Types.ObjectId(resumeId));

        downloadStream.on("data", (chunk) => {
            res.write(chunk);
        });

        downloadStream.on("end", () => {
            res.end();
        });

        downloadStream.on("error", (error) => {
            res.status(404).json({ error: error.message });
        });
    } catch (error) {
        return res.status(500).json({
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};