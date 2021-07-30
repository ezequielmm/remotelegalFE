export enum ACTION_TYPE {
    SET_SORTING = "SET_SORTING",
    SET_PAGE_NUMBER = "SET_PAGE_NUMBER",
    SET_FILTER = "SET_FILTER",
    CLEAR = "CLEAR",
}

const actions = {
    setSorting: (payload) => ({
        type: ACTION_TYPE.SET_SORTING,
        payload,
    }),
    setPageNumber: (payload) => ({
        type: ACTION_TYPE.SET_PAGE_NUMBER,
        payload,
    }),
    setFilter: (payload) => {
        return {
            type: ACTION_TYPE.SET_FILTER,
            payload,
        };
    },
    clear: () => {
        return {
            type: ACTION_TYPE.CLEAR,
        };
    },
};

export default actions;
