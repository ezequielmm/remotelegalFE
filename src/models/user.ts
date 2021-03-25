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
    isGuest?: boolean;
}

export type UserInfo = {
    isUser: boolean;
    participant: {
        id: string;
        creationDate: string;
        name: string;
        email: string;
        phone: string;
        role: string;
        hasJoined: boolean;
        isAdmitted: boolean;
        user?: IUser;
    } | null;
};
