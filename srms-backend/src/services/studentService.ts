import { StudentModel, IStudent } from "../models/student.model";

export const StudentService = {
  // Get all students
  getAll: async () => {
    return await StudentModel.find().lean();
  },

  // Get student by studentId
  getStudentById: async (studentId: string) => {
    return await StudentModel.findOne({ studentId }).lean();
  },

  // Create student
  create: async (data: {
    studentId: string;
    name: string;
    email?: string;
    department?: string;
    records?: any[];
  }) => {
    const student = new StudentModel(data);
    await student.save();
    return student.toObject();
  },

  // Update student
  updateStudentById: async (
    studentId: string,
    updates: Partial<IStudent>
  ) => {
    return await StudentModel.findOneAndUpdate(
      { studentId },
      updates,
      { new: true }
    ).lean();
  },

  // Delete student
  deleteStudentById: async (studentId: string) => {
    const result = await StudentModel.deleteOne({ studentId });
    return result.deletedCount === 1;
  },

  // Add record to student
  addRecordToStudent: async (
    studentId: string,
    record: {
      recordId: string;
      fileHash?: string;
      ipfsCid?: string;
      blockchainTxHash?: string;
      issueDate?: Date;
      issuerAdmin?: string;
      status?: "pending" | "verified" | "on-chain";
    }
  ) => {
    return await StudentModel.findOneAndUpdate(
      { studentId },
      {
        $push: {
          records: {
            ...record,
            issueDate: record.issueDate ?? new Date(),
          },
        },
      },
      { new: true }
    ).lean();
  },

  // ✅ UPDATE RECORD STATUS
  updateRecordStatus: async (
    studentId: string,
    recordId: string,
    status: "pending" | "verified" | "on-chain"
  ) => {
    return await StudentModel.findOneAndUpdate(
      {
        studentId,
        "records.recordId": recordId,
      },
      {
        $set: {
          "records.$.status": status,
        },
      },
      { new: true }
    ).lean();
  },
  
  findByRecordHash: async (recordId: string) => {
    return await StudentModel.findOne({
      "records.recordId": recordId
    }).lean();
  },

};
