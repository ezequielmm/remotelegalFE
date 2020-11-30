import { IGlobalState } from "../models/general";
import { LocalDataTrack, Room } from "twilio-video";

export interface IAction<T = string, P = any> {
    type: T;
    payload: P;
}

export type IReducer<S = any, A = any> = (state: S, action: IAction<A>) => S;

export interface IGlobalReducer {
    reducer: IReducer;
    initialState: IGlobalState;
}

export type DataTrackMessage = { module: string; value: any } | null;

export type DisconnectRoomState = {
    token?: string;
    info?: object;
    currentRoom?: Room;
    error?: string;
    message?: DataTrackMessage;
    dataTrack?: LocalDataTrack | null;
};
