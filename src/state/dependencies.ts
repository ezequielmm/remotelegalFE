/* eslint-disable import/prefer-default-export */
import { ApiService } from "../services/ApiService";
import { Deps } from "../models/general";

export const getDeps = (): Deps => {
    const fetchWithRejections = async (input: RequestInfo, init?: RequestInit): Promise<Response> => {
        const response = await fetch(input, init);
        if (response.status >= 200 && response.status < 400) return response;
        throw response;
    };
    const apiService = new ApiService(fetchWithRejections);
    return { apiService };
};
