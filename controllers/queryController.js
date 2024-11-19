import Query from "../models/queryModel.js";
import logAuditAction from "../middleware/auditLogsMiddleware.js"

export const newQuery = async (req, res) => {
  try {
    const { subject, query } = req.body;

    // Ensure that the required fields are provided
    if (!subject || !query) {
      return res
        .status(400)
        .json({ message: "Both subject and query are required." });
    }

    // Create a new query document
    const result = new Query({
      userId: req.user.userId,
      subject,
      query,
    });

    // Save the new query to the database
    await result.save();

    // Log the audit action for query submission
    await logAuditAction(
      req.user.userId,
      "QUERY SUBMITTED",
      "Query",
      `User submitted a new query: ${query}`
    );

    // Return a success response
    return res.status(201).json({ message: "Query submitted successfully." });
  } catch (error) {
    // Handle internal server errors gracefully
    console.error("Error submitting query:", error); // Log the error for debugging
    return res.status(500).json({
      message: "Internal server error",
      error: error.message || "An unexpected error occurred.",
    });
  }
};

export const getAllQuery = async (req, res) => {
  try {
    const result = await Query.find({}).populate({
      path: "userId",
      select: "userName email",
    });
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
    const result = await Query.findById(id).populate({
      path: "userId",
      select: "userName email",
    });
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
    const result = await Query.find({ status: false }).populate({
      path: "userId",
      select: "userName email",
    });
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
    const status = true;
    if (!response) {
      return res.status(404).json({ message: "response is required" });
    }
    const result = await Query.findByIdAndUpdate(
      id,
      { response, status },
      {
        new: true,
        runValidators: true,
      }
    ).populate({ path: "userId", select: "userName" });
    if (!result) {
      return res.status(404).json({ message: "response updated failed" });
    }
    await logAuditAction(
      req.user.userId,
      "QUERY RESPONSE",
      "Query",
      `Manager responded to ${result.userId.userName}'s query. response is : '${response}'`
    );
    return res.status(200).json({ message: "success", data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
