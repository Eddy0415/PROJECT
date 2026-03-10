export interface IAuthResp {
  token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    dateOfBirth: Date;
    imageUrl: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  };
}
