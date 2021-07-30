import { Reducer } from "react";
import { SorterResult } from "antd/lib/table/interface";
import { IAction } from "../types";
import { ACTION_TYPE } from "./DepositionsListActions";

export interface IDepositionsListFilter {
    PastDepositions?: boolean | undefined;
    MinDate?: string | undefined;
    MaxDate?: string | undefined;
}

export interface IDepositionsListReducer {
    sorting?: SorterResult<string> | undefined;
    pageNumber?: number;
    filter?: IDepositionsListFilter | undefined;
}

export const DepositionsListReducerInitialState: IDepositionsListReducer = {
    sorting: undefined,
    pageNumber: 1,
    filter: undefined,
};

const DepositionsListReducer: Reducer<IDepositionsListReducer, IAction> = (
    state: IDepositionsListReducer,
    action: IAction
): IDepositionsListReducer => {
    switch (action.type) {
        case ACTION_TYPE.SET_SORTING:
            return {
                ...state,
                sorting: action.payload,
            };
        case ACTION_TYPE.SET_PAGE_NUMBER:
            return {
                ...state,
                pageNumber: action.payload,
            };
        case ACTION_TYPE.SET_FILTER:
            return {
                ...state,
                filter: action.payload,
            };
        case ACTION_TYPE.CLEAR:
            return {
                sorting: undefined,
                pageNumber: 1,
                filter: undefined,
            };

        default:
            return state;
    }
};

export default DepositionsListReducer;
