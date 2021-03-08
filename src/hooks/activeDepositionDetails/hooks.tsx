import React from "react";
import { GlobalStateContext } from "../../state/GlobalState";
import useAsyncCallback from "../useAsyncCallback";

export const useFetchCaption = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async (depositionID: string) => {
        const caption = await deps.apiService.fetchCaption(depositionID);
        return caption;
    }, []);
};

export const useFetchParticipants = () => {
    const { deps } = React.useContext(GlobalStateContext);
    return useAsyncCallback<any, any>(async (depoID, payload) => {
        const response = await deps.apiService.fetchParticipants(depoID, payload);
        return response;
    }, []);
};

export const useAddParticipantToExistingDepo = () => {
    const { deps } = React.useContext(GlobalStateContext);
    return useAsyncCallback<any, any>(async (depoID, payload) => {
        const response = await deps.apiService.addParticipantToExistingDepo(depoID, payload);
        return response;
    }, []);
};

export const useRemoveParticipantFromExistingDepo = () => {
    const { deps } = React.useContext(GlobalStateContext);
    return useAsyncCallback<any, any>(async (depoID, payload) => {
        const response = await deps.apiService.removeParticipantFromExistingDepo(depoID, payload);
        return response;
    }, []);
};

export const useEditDeposition = () => {
    const { deps } = React.useContext(GlobalStateContext);

    return useAsyncCallback(async (depositionID: string, payload, file?, deleteCaption?) => {
        const editedDeposition = await deps.apiService.editDeposition(depositionID, payload, file, deleteCaption);
        return editedDeposition;
    }, []);
};
