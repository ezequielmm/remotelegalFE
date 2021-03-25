import { DateLike } from "./general";
import { IUser } from "./user";

export enum Roles {
    admin = "Admin",
    attorney = "Attorney",
    courtReporter = "CourtReporter",
    witness = "Witness",
    interpreter = "Interpreter",
    observer = "Observer",
    paralegal = "Paralegal",
    techExpert = "Tech Expert",
}
export interface IParticipant {
    id?: string;
    emailAddress?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role?: Roles;
    phone?: string;
    hasJoined?: boolean;
    isAdmitted?: boolean;
    creationDate?: DateLike;
    user?: IUser;
}
