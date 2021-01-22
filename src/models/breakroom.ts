import { ParticipantModel } from ".";

export interface Breakroom {
    id: string;
    name: string;
    isLocked?: boolean;
    currentAttendees?: ParticipantModel.IParticipant[];
}
