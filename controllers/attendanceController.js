import mongoose from "mongoose";
import Attendance from "../models/attendanceModel.js";
import logAuditAction from "../middleware/auditLogsMiddleware.js";

let attendanceBucket;
mongoose.connection.once("open", () => {
    attendanceBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "attendanceImage",
    });
});

export const addArrival = async (req, res) => {
    try {
        const arrivalDate = new Date();
        const id = req.user.userId;

        if (!req.file) {
            return res.status(400).json({ error: "image is required" });
        }

        const uploadStream = attendanceBucket.openUploadStream(req.file.originalname);
        uploadStream.end(req.file.buffer);

        uploadStream.on("finish", async () => {
            const newAttendance = new Attendance({
                image: req.file.originalname,
                imageId: uploadStream.id,
                userId: id,
                arrivalDate
            });

            const result = await newAttendance.save();
            await logAuditAction(id, 'ARRIVAL ADDED', 'Attendance', 'Arrival record created');
            return res
                .status(201)
                .json({ message: "Arrival record created", data: result });
        });

        uploadStream.on("error", (error) => {
            return res.status(400).json({ message: "image upload failed , try again", error: error.message });
        });


    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
};

export const updateDeparture = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { userRemark } = req.body;


        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();

        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const endOfDay = new Date(now.setHours(23, 59, 59, 999));

        // Define the target time
        const targetHour = 19;
        const targetMinute = 30;
        const isAfterTargetTime =
            currentHour > targetHour ||
            (currentHour === targetHour && currentMinute >= targetMinute);

        const existingRecord = await Attendance.findOne({
            userId,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        }).populate({path:"userId",select:"userName"});

        if (!existingRecord) {
            return res.status(404).json({
                message: "Your email is not valid or you have not updated arrival.",
            });
        }

        if (existingRecord.departureDate) {
            return res.status(404).json({
                message: "Departure already updated.",
            });
        }

        if (isAfterTargetTime) {
            existingRecord.departureDate = new Date();
            await existingRecord.save();
            return res.status(200).json({ message: "Updated departure time successfully." });
        }

        if (!isAfterTargetTime) {
            if (
                existingRecord.userRemark &&
                existingRecord.userRemark.trim() !== "" &&
                existingRecord.status === true
            ) {
                existingRecord.departureDate = new Date();
                await existingRecord.save();
                await logAuditAction(userId, 'DEPARTURE UPDATED', 'Attendance', `${existingRecord.userId.userName} Departure time updated successfully` );
                return res.status(200).json({ message: "Updated departure time successfully." });
            }

            if (
                existingRecord.userRemark &&
                existingRecord.userRemark.trim() !== "" &&
                existingRecord.status === false
            ) {
                return res.json({ message: "Wait for admin response." });
            }

            if (!userRemark) {
                return res.json({ message: "Please enter userRemark." });
            }

            existingRecord.userRemark = userRemark;
            existingRecord.departureDate = new Date();
            await existingRecord.save();
            await logAuditAction(userId, 'REMARK UPDATED', 'Attendance', `${existingRecord.userId.userName} remark added for early departure, awaiting for admin response`);
            return res.status(200).json({ message: "Remarks updated. wait admin response" });
        }

        return res.status(401).json({ message: "Something went wrong." });

    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
};

export const getAttendanceImage = (req, res) => {
    try {
        const { imageId } = req.params;
        const downloadStream = attendanceBucket.openDownloadStream(new mongoose.Types.ObjectId(imageId));

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
        return res.status(500).json({ message: 'Internal server error',
            error: error.message,
        });
    }
};

export const approveEarlyDeparture = async (req, res) => {
    try {
        const { id } = req.params;
        const {approve,adminResponse } = req.body;
        const existingRecord = await Attendance.findById(id).populate({ path: "userId", select: "userName" });
        if (!existingRecord) {
            return res
                .status(404)
                .json({ success: false, message: "Attendance record not found." });
        }

        if (approve === false) {
            existingRecord.status = false;
            existingRecord.adminResponse = adminResponse;
            await existingRecord.save();
            await logAuditAction(req.user.userId, 'EARLY DEPARTURE REJECTED', 'Attendance', `${existingRecord.userId.userName} Early departure request rejected`);
            return res.status(200).json({ success: false, message: "Rejected.",data:existingRecord });
        }

        if (approve === true) {
            existingRecord.status = true;
            existingRecord.adminResponse = adminResponse;
            await existingRecord.save();
            await logAuditAction(req.user.userId, 'EARLY DEPARTURE APPROVED', 'Attendance', `${existingRecord.userId.userName} Early departure request approved`);
            return res.status(200).json({ success: true, message: "Approved.",data:existingRecord });
        }

        return res
            .status(400)
            .json({ success: false, message: "Invalid approval status." });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error',
            error: error.message,
        });
    }
};

export const getTodayOneUserAttendance = async (req, res) => {
    const { userId } = req.params;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    try {
        const record = await Attendance.findOne({
            userId,
            createdAt: {
                $gte: startOfDay,
                $lt: endOfDay,
            },
        });
        if (record) {
            return res.status(200).json({
                success: true,
                data: record,
            });
        } else {
            return res
                .status(404)
                .json({ success: false, message: "Attendance record not found" });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error',error:error.message})
    }
};

export const getAllAttendance = async (req, res) => {
    try {
        const records = await Attendance.find({}).populate({path:"userId",select:"userName email"}).sort({ arrivalDate: 1 });
        return res.status(200).json({
            success: true,
            data: records,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error',error:error.message})
    }
};