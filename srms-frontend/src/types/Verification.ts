export interface VerifiedStudent {
  name: string;
  studentId: string;
  department: string;
}

export interface VerifiedRecord {
  recordId: string;
  graduationYear: number;
  issueDate: string;
  blockchainTxHash?: string;
}

export interface VerifyResponse {
  valid: boolean;
  student: VerifiedStudent;
  record: VerifiedRecord;
}