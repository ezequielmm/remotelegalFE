import { DateLike, TimeZones } from "./general";
import { IParticipant } from "./participant";
import { IUser } from "./user";

export enum DepositionStatus {
    pending = "Pending",
    approved = "Approved",
    canceled = "Canceled",
}

export enum DepositionPermissionsTypes {
    recording = "Recording",
    endDeposition = "EndDeposition",
    stampExhibit = "StampExhibit",
}

export type DepositionPermissions = [
    DepositionPermissionsTypes.recording?,
    DepositionPermissionsTypes.endDeposition?,
    DepositionPermissionsTypes.stampExhibit?
];

export interface IDepositionPermissions {
    permissions: DepositionPermissions;
}

export interface IDeposition {
    id: string;
    caseName: string;
    caseNumber: string;
    creationDate: DateLike;
    startDate: DateLike;
    endDate: DateLike;
    timeZone: TimeZones;
    status?: string;
    job?: string;
    caption: string;
    witness?: IParticipant;
    isVideoRecordingNeeded: boolean;
    requester: IUser;
    participants: IParticipant[];
    details?: string;
    room: string;
    documents: string;
    token?: string;
}

export interface ICreateDeposition {
    isVideoRecordingNeeded: string;
    date: string;
    startTime: string;
    timeZone: TimeZones;
    witness?: IParticipant;
    endTime?: string;
    file?: File & { uid: string };
}
