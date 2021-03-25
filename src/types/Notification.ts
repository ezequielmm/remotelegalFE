export enum NotificationEntityType {
    transcript = "transcript",
    participantStatus = "participantStatus",
}

export enum NotificationAction {
    create = "create",
    update = "update",
    delete = "delete",
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