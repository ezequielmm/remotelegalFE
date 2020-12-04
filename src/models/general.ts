import { Dispatch } from "react";
import { ApiService } from "../services/ApiService";
import { IRoom } from "../state/InDepo/InDepoReducer";

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
