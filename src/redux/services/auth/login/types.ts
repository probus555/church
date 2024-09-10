interface LoginResponse {
  message: string;
  status: number | string;
  data: {employeeId: string | number};
}

interface LoginApiArgs {
  loginId: string;
  password: string;
}

interface FCMArgs {
  fcmTokens:string ;
}

export type {LoginResponse, LoginApiArgs,FCMArgs};
