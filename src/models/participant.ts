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
    email: string;
    name: string;
    role?: Roles;
    phone?: string;
    creationDate?: DateLike;
    user?: IUser;
}
