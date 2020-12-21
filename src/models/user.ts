import { DateLike } from "./general";

export interface IUser {
    id?: string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    password?: string;
    companyName?: string;
    phoneNumber?: string;
    creationDate?: DateLike;
    isAdmin?: boolean;
}
