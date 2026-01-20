export interface VerifiedStudent {
  name: string;
  studentId: string;
  department: string;
}

export interface VerifiedRecord {
  graduationYear: number;
  issuedAt: string;
  certUrl: string;
  reportCardUrl: string;
  photoUrl: string;
}

export interface VerifyResponse {
  valid: boolean;
  student: VerifiedStudent;
  record: VerifiedRecord;
}
