import { Dayjs } from "dayjs";
import { Status } from "@rl/prp-components-library/src/components/StatusPill/StatusPill";
import { DateLike, TimeZones } from "./general";
import { IParticipant } from "./participant";
import { IUser } from "./user";

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
    requesterNotes?: string;
    addedBy?: IUser;
    caseName: string;
    caseNumber: string;
    creationDate: DateLike;
    startDate: DateLike;
    actualStartDate?: DateLike;
    endDate: DateLike;
    completeDate: DateLike;
    timeZone: TimeZones;
    status?: Status;
    job?: string;
    caption: {
        displayName: string;
    };
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
    date: Dayjs | string;
    startTime: Dayjs | string;
    timeZone: TimeZones;
    witness?: IParticipant;
    endTime?: Dayjs | string;
    file?: File & { uid: string };
}
