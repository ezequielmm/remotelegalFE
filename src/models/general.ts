import { Dispatch } from "react";
import { ApiService } from "../services/ApiService";
import { IRoom } from "../state/InDepo/InDepoReducer";
import { IGeneralUi } from "../state/GeneralUi/GeneralUiReducer";
import { IPostDepo } from "../state/PostDepo/PostDepoReducer";
import { IUserPermissions } from "../state/UserPermissions/UserPermissionsReducer";
import { ISignalR } from "../state/SignalR/SignalRReducer";

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
    userPermissions: IUserPermissions;
    signalR: ISignalR;
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
    ET = "ET",
    AT = "AT",
    CT = "CT",
    MT = "MT",
    PT = "PT",
    AKT = "AKT",
    HT = "HT",
    AZ = "AZ",
}

export const mapTimeZone = {
    [TimeZones.AT]: "America/Puerto_Rico",
    [TimeZones.AZ]: "America/Phoenix",
    [TimeZones.ET]: "America/New_York",
    [TimeZones.CT]: "America/Chicago",
    [TimeZones.MT]: "America/Denver",
    [TimeZones.PT]: "America/Los_Angeles",
    [TimeZones.AKT]: "America/Anchorage",
    [TimeZones.HT]: "Pacific/Honolulu",
};
