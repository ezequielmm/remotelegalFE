export enum ACTION_TYPE {
    GENERAL_UI_CHANGE_SIDER_STATUS = "GENERAL_UI_CHANGE_SIDER_STATUS",
    TOGGLE_THEME = "TOGGLE_THEME",
}

const actions = {
    changeSiderStatus: () => ({
        type: ACTION_TYPE.GENERAL_UI_CHANGE_SIDER_STATUS,
    }),

    toggleTheme: (payload) => ({
        type: ACTION_TYPE.TOGGLE_THEME,
        payload,
    }),
};

export default actions;
