export interface Record {
  recordId: string;
  status?: string;
}

export interface Student {
  _id: string;
  studentId: string;
  name: string;
  email?: string;
  department?: string;
  records: Record[];
}
