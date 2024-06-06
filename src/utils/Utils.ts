export function generateOTP(): string {
  const min = 10000;
  const max = 99999;
  return (Math.floor(Math.random() * (max - min + 1)) + min).toString();
}

export enum userUpdateDetails {
  'Name',
  'DOB',
  'Email',
  'Fee',
  'Phone',
  'Gender',
  'Bio',
  'Active',
}

