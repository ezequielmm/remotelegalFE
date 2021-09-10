export enum NotificationEntityType {
    transcript = "transcript",
    participantStatus = "participantStatus",
    annotation = "annotation",
    bringAllTo = "bringAllTo",
    deposition = "deposition",
    joinResponse = "joinResponse",
    lockBreakRoom = "lockBreakRoom",
    endDeposition = "endDeposition",
    exhibit = "exhibit",
    stamp = "stamp",
}

export enum NotificationAction {
    create = "create",
    update = "update",
    delete = "delete",
    start = "start",
    error = "error",
    close = "close",
}
export interface Notification {
    entityType: NotificationEntityType;
    action: NotificationAction;
    content: Record<string, any>;
}
