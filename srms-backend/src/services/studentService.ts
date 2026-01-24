import { StudentModel, IStudent } from "../models/student.model";
import { Types } from "mongoose";

export const StudentService = {
  getAll: async () =>
    StudentModel.find().select("-password").lean<IStudent[]>(),

  getStudentByMongoId: async (id: string) =>
    Types.ObjectId.isValid(id)
      ? StudentModel.findById(id).select("-password").lean<IStudent | null>()
      : null,

  getStudentByStudentId: async (studentId: string) =>
    StudentModel.findOne({ studentId })
      .select("-password")
      .lean<IStudent | null>(),

  create: async (data: any) => {
    const student = new StudentModel({ ...data, role: "student", records: [] });
    await student.save();
    return student.toObject();
  },

  deleteStudentByStudentId: async (studentId: string) =>
    (await StudentModel.deleteOne({ studentId })).deletedCount === 1,

  addRecordToStudent: async (
    studentId: string,
    record: {
      recordId: string;
      blockchainTxHash?: string;
      issuerAdmin?: string;
      status?: "pending" | "verified" | "on-chain";
      graduationYear: number;
      percentage: number;
    }
  ) =>
    StudentModel.findOneAndUpdate(
      { studentId },
      { $push: { records: { ...record, issueDate: new Date() } } },
      { new: true }
    )
      .select("-password")
      .lean<IStudent | null>(),

  findByRecordHash: async (recordHash: string) =>
    StudentModel.findOne({ "records.recordId": recordHash })
      .select("-password")
      .lean<IStudent | null>()
};