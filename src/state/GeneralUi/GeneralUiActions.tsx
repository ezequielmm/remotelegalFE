export enum ACTION_TYPE {
    GENERAL_UI_CHANGE_SIDER_STATUS = "GENERAL_UI_CHANGE_SIDER_STATUS",
}

const actions = {
    changeSiderStatus: () => ({
        type: ACTION_TYPE.GENERAL_UI_CHANGE_SIDER_STATUS,
    }),
};

export default actions;
