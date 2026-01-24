export interface Record {
  recordId: string;                 // final immutable record hash
  certHash: string;                 // hash of certificate PDF
  reportCardHash: string;           // hash of report card PDF
  photoHash: string;                // hash of student photo
  graduationYear?: number;
  percentage?: number;
  blockchainTxHash?: string;        // tx hash after chain write
  status: "pending" | "verified" | "on-chain";
  issuedAt?: Date;
}

export interface Student {
  _id: string;
  studentId: string;                // roll number / unique ID
  name: string;
  email: string;
  department: string;
  graduationYear: number;
  percentage: number;
  records: Record[];
}
