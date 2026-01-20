import { StudentModel, IStudent, IRecord } from "../models/student.model";

/* =========================
   RECORD PAYLOAD TYPE
========================= */

export type AddRecordPayload = {
  recordId: string;
  fileHash?: string;
  ipfsCid?: string;
  blockchainTxHash?: string;
  issueDate?: Date;
  issuerAdmin?: string;
  graduationYear?: number;
  percentage?: number;
  status?: "pending" | "verified" | "on-chain";
};

/* =========================
   STUDENT SERVICE
========================= */

export const StudentService = {
  /* ---------- STUDENTS ---------- */

  getAll: async () => {
    return StudentModel.find().lean();
  },

  getStudentById: async (studentId: string) => {
    return StudentModel.findOne({ studentId }).lean();
  },

  create: async (data: {
    studentId: string;
    name: string;
    email?: string;
    department?: string;
    records?: IRecord[];
  }) => {
    const student = new StudentModel(data);
    await student.save();
    return student.toObject();
  },

  updateStudentById: async (
    studentId: string,
    updates: Partial<IStudent>
  ) => {
    return StudentModel.findOneAndUpdate(
      { studentId },
      updates,
      { new: true }
    ).lean();
  },

  deleteStudentById: async (studentId: string) => {
    const result = await StudentModel.deleteOne({ studentId });
    return result.deletedCount === 1;
  },

  /* ---------- RECORDS ---------- */

  addRecordToStudent: async (
    studentId: string,
    record: AddRecordPayload
  ) => {
    return StudentModel.findOneAndUpdate(
      { studentId },
      {
        $push: {
          records: {
            ...record,
            issueDate: record.issueDate ?? new Date()
          }
        }
      },
      { new: true }
    ).lean();
  },

  updateRecordStatus: async (
    studentId: string,
    recordId: string,
    status: "pending" | "verified" | "on-chain"
  ) => {
    return StudentModel.findOneAndUpdate(
      {
        studentId,
        "records.recordId": recordId
      },
      {
        $set: {
          "records.$.status": status
        }
      },
      { new: true }
    ).lean();
  },

  findByRecordHash: async (recordId: string) => {
    return StudentModel.findOne({
      "records.recordId": recordId
    }).lean();
  }
};
