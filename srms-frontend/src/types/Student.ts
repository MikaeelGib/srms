export interface Record {
  recordId: string;
  status?: string;
  fileHash: string;
  txHash?: string;
}

export interface Student {
  _id: string;
  studentId: string;
  fullName: string;
  email?: string;
  department?: string;
  records: Record[];
}
