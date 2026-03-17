export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  LATE = 'LATE',
  ABSENT = 'ABSENT',
  OUTSIDE_AREA = 'OUTSIDE_AREA'
}

export interface CheckInBody {
  userId: string; 
  status: AttendanceStatus;
}