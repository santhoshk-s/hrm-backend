import mongoose from "mongoose";
import AuditLog from "../models/auditLogsModel.js";

export const getAllLogs = async (req,res) => {
    try {
        const result = await AuditLog.find({}).populate({path:'userId',select:"userName email"})
        return res.status(200).json({ message: 'success', data:result })
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message })
    }
}