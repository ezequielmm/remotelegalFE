export interface IUser {
    id: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    password: string;
    phoneNumber: string;
    creationDate: Date | string | number;
}
