import { Reducer } from "react";
import { IAction } from "../types";
import { ACTION_TYPE } from "./GeneralUiActions";

export interface IGeneralUi {
    isSiderCollapsed: boolean;
}

export const GeneralUiReducerInitialState: IGeneralUi = {
    isSiderCollapsed: false,
};

const GeneralUiReducer: Reducer<IGeneralUi, IAction> = (state: IGeneralUi, action: IAction): IGeneralUi => {
    switch (action.type) {
        case ACTION_TYPE.GENERAL_UI_CHANGE_SIDER_STATUS: {
            return {
                ...state,
                isSiderCollapsed: !state.isSiderCollapsed,
            };
        }
        default:
            return state;
    }
};

export default GeneralUiReducer;
