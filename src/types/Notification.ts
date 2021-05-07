export enum NotificationEntityType {
    transcript = "transcript",
    participantStatus = "participantStatus",
    annotation = "annotation",
    bringAllTo = "bringAllTo",
    deposition = "deposition",
    joinResponse = "joinResponse",
    lockBreakRoom = "lockBreakRoom",
    endDeposition = "endDeposition",
}

export enum NotificationAction {
    create = "create",
    update = "update",
    delete = "delete",
    start = "start",
}

export interface NotificationParticipantStatusContent {
    isMuted: boolean;
    email: string;
}

export type Notification = {
    entityType: NotificationEntityType;
    action: NotificationAction;
    content: NotificationParticipantStatusContent;
};
