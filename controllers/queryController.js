import Query from "../models/queryModel.js";

export const newQuery = async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(404).json({ message: "all fields are required" });
    }
    const result = new Query({ userId: req.user.userId, query });
    await result.save();
    await logAuditAction(req.user.userId, 'QUERY SUBMITTED', 'Query', `User submitted a new query: ${query}`);
    return res.status(201).json({ message: "Query submitted" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getAllQuery = async (req, res) => {
  try {
    const result = await Query.find({}).populate({path:'userId',select:"userName email"});
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const getOneQuery = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Query.findById(id).populate({path:'userId',select:"userName email"});
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Query is sent directly to the Manager
export const getPendingQuery = async (req, res) => {
  try {
    const result = await Query.find({ status: false }).populate({path:'userId',select:"userName email"});
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

// Manager receives a notification and responds through the system.
export const queryResponse = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const status =true
    if(!response){
        return res.status(404).json({ message: "response is required" });
    }
    const result = await Query.findByIdAndUpdate(id, {response,status}, {
      new: true,
      runValidators: true,
    }).populate({ path: "userId", select: "userName" });
    if (!result) {
      return res.status(404).json({ message: "response updated failed" });
    }
    await logAuditAction(req.user.userId, 'QUERY RESPONSE', 'Query', `Manager responded to ${result.userId.userName}'s query. response is : '${response}'`);
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
