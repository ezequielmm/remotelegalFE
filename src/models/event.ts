import { DateLike } from "./general";

export enum EventType {
    onTheRecord = "OnTheRecord",
    offTheRecord = "OffTheRecord",
}

export interface IEvent {
    id: string;
    creationDate: DateLike;
    eventType: EventType;
    user: string;
    details: string;
}
