export enum ACTION_TYPE {
    USER_PERMISSIONS_IS_ADMIN = "USER_PERMISSIONS_IS_ADMIN",
}

const actions = {
    setIsAdmin: (isAdmin) => ({
        type: ACTION_TYPE.USER_PERMISSIONS_IS_ADMIN,
        payload: { isAdmin },
    }),
};

export default actions;
