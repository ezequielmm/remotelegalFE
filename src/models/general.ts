import { Dispatch } from "react";
import { ApiService } from "../services/ApiService";
import { IRoom } from "../state/InDepo/InDepoReducer";
import { IGeneralUi } from "../state/GeneralUi/GeneralUiReducer";
import { IPostDepo } from "../state/PostDepo/PostDepoReducer";

export interface IAction<T = string, P = any> {
    type: T;
    payload: P;
}

export type IReducer<S = any, A = any> = (state: S, action: IAction<A>) => S;

export interface IGlobalReducer {
    reducer: IReducer;
    initialState: IGlobalState;
}

export interface Deps {
    apiService: ApiService;
}

export type IGlobalState = {
    room: IRoom;
    generalUi: IGeneralUi;
    postDepo: IPostDepo;
};

export interface IGlobalContext {
    state: IGlobalState;
    dispatch: Dispatch<IAction<any, any>>;
    deps: Deps;
}

export enum HTTP_METHOD {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
}

export interface ITokenSet {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiryTime: number;
}

export type DateLike = Date | string | number;

export enum TimeZones {
    EST = "EST",
    CST = "CST",
    MST = "MST",
    PST = "PST",
}

export const mapTimeZone = {
    [TimeZones.CST]: "America/Chicago",
    [TimeZones.EST]: "America/New_York",
    [TimeZones.PST]: "America/Los_Angeles",
    [TimeZones.MST]: "America/Denver",
};
