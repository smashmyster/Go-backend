export class SignUpDTO {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  expoPushNotificationToken: string;
  DOB: Date;
  genderValue: number;
}

export class SignUpCheckCredentialsDTO {
  email?: string;
  phoneNumber?: string;
  username?: string;
}
