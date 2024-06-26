interface LoginResponse {
  message: string;
  status: number | string;
  data: {employeeId: string | number};
}

interface LoginApiArgs {
  loginId: string;
  password: string;
}

export type {LoginResponse, LoginApiArgs};
