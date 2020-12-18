import { LocalDataTrack, Room } from "twilio-video";
import { IGlobalState } from "../models/general";

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

export type DepositionID = {
    depositionID: string;
};

export type DisconnectRoomState = {
    token?: string;
    info?: object;
    currentRoom?: Room;
    error?: string;
    message?: DataTrackMessage;
    dataTrack?: LocalDataTrack | null;
};
