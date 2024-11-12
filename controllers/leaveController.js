import Leave from "../models/leaveReaquestModel.js";

export const leaveApply = async (req, res) => {
    try {
        const {dates,reason} =req.body
        if(!dates || !reason){
            return res.status(404).json({message:"all fields are required"})
        }
        const result = new Leave({userId:req.user.userId,dates,reason});
        await result.save()
        return res.status(200).json({ message: "Leave apply success" });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}

export const approveLeave = async (req,res) => {
    try {
        const role = req.user.role
        const {id} = req.params
        const {managerComments,hrComments} = req.body
        const leave = await Leave.findById(id);
        if (role==='hr') {
            leave.status = 'approved by hr';
            leave.hrComments = hrComments;
            await leave.save();
            return res.status(200).json({message:"leave approved"});
        };
        if (role==='manager') {
            leave.status = 'approved by manager';
            leave.managerComments = managerComments;
            await leave.save();
            return res.status(200).json({message:"leave approved"});
        };
        return res.status(401).json({message:"something went wrong"});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}

export const rejectLeave = async (req,res) => {
    try {
        const role = req.user.role
        const {id} = req.params
        const {managerComments,hrComments} = req.body
        const leave = await Leave.findById(id);
        if (role==='hr') {
            leave.status = 'rejected';
            leave.hrComments = hrComments;
            await leave.save();
            return res.status(200).json({message:"leave rejected"});
        };
        if (role==='manager') {
            leave.status = 'rejected';
            leave.managerComments = managerComments;
            await leave.save();
            return res.status(200).json({message:"leave rejected"});
        };
        return res.status(401).json({message:"something went wrong"});
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}

export const getPendingLeaves = async (req,res) => {
    try {
        const result = await Leave.find({status:"pending"})
        return res.status(200).json({ message: "success",data:result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}
export const getForHrLeaves = async (req,res) => {
    try {
        const result = await Leave.find({status:"approved by manager"})
        return res.status(200).json({ message: "success",data:result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}

export const getAllLeaves = async (req,res) => {
    try {
        const result = await Leave.find({}).populate("userId").sort({ createdAt: -1 })
        return res.status(200).json({ message: "success",data:result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}

export const getOneLeaves = async (req,res) => {
    try {
        const result = await Leave.findOne({userId:req.user.userId}).populate({path:'userId',select:"userName email mobile"}).sort({ createdAt: 1 })
        console.log(result)
        return res.status(200).json({ message: "success",data:result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}

export const deleteLeave = async (req,res) => {
    try {
        const {id} = req.params;
        const result = await Leave.findByIdAndDelete(id)
        return res.status(200).json({ message: "success",data:result });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error",error:error.message });
    }
}