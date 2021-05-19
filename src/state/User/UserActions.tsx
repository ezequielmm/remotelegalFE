export enum ACTION_TYPE {
    SET_CURRENT_USER = "SET_CURRENT_USER",
}

const actions = {
    setCurrentUser: (payload) => ({
        type: ACTION_TYPE.SET_CURRENT_USER,
        payload,
    }),
};

export default actions;
