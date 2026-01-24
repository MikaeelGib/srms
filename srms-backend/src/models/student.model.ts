import mongoose, { Schema, Document } from "mongoose";

export interface IRecord {
  recordId: string;
  fileHash?: string;
  blockchainTxHash?: string;
  issuerAdmin?: string;
  status?: "pending" | "verified" | "on-chain";
  graduationYear: number;
  percentage: number;
  issueDate: Date;
}

export interface IStudent extends Document {
  studentId: string;
  name: string;
  email?: string;
  department?: string;
  password?: string;
  role: "student" | "admin";
  records: IRecord[];
}

const RecordSchema = new Schema<IRecord>({
  recordId: { type: String, required: true },
  fileHash: String,
  blockchainTxHash: String,
  issuerAdmin: String,
  status: {
    type: String,
    enum: ["pending", "verified", "on-chain"],
    default: "pending"
  },
  graduationYear: { type: Number, required: true },
  percentage: { type: Number, required: true },
  issueDate: { type: Date, default: Date.now }
});

const StudentSchema = new Schema<IStudent>({
  studentId: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  email: String,
  department: String,
  password: String,
  role: { type: String, default: "student" },
  records: [RecordSchema]
});

export const StudentModel = mongoose.model<IStudent>(
  "Student",
  StudentSchema
);