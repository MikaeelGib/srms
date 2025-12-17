import { Schema, model, Document } from "mongoose";

export interface IRecord {
  recordId: string;
  fileHash?: string;
  ipfsCid?: string;
  blockchainTxHash?: string;
  issueDate?: Date;
  issuerAdmin?: string;
  status?: "pending" | "verified" | "on-chain";
}

export interface IStudent extends Document {
  studentId: string;
  name: string;
  email?: string;
  password?: string;
  department?: string;
  records: IRecord[];
  createdAt: Date;
  updatedAt: Date;
}

const RecordSchema = new Schema<IRecord>(
  {
    recordId: { type: String, required: true },
    fileHash: { type: String },
    ipfsCid: { type: String },
    blockchainTxHash: { type: String },
    issueDate: { type: Date },
    issuerAdmin: { type: String },
    status: {
      type: String,
      enum: ["pending", "verified", "on-chain"],
      default: "pending"
    },
  },
  { _id: false }
);

const StudentSchema = new Schema<IStudent>(
  {
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    password: { type: String },
    department: { type: String },
    records: { type: [RecordSchema], default: [] }
  },
  { timestamps: true }
);

export const StudentModel = model<IStudent>("Student", StudentSchema);
