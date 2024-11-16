import AuditLog from "../models/auditLogsModel.js"; 

async function logAuditAction(userId, action, resource, description, additionalData = {}) {
  const log = new AuditLog({
    userId,
    action: action,
    resource: resource,
    description: description,
    additionalData: additionalData
  });

  try {
    await log.save();
  } catch (error) {
    console.error('Error logging audit action:', error);
  }
}

export default logAuditAction;  
