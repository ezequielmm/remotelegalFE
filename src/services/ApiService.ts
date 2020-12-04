/* eslint-disable import/prefer-default-export */
/* eslint-disable no-console */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
/* istanbul ignore file */
/**
 * Ignoring this file for testing because we don't want to test every endpoint (configuration).
 * We will, however test methods and behaviors such as placing the token in each call, waiting for connection to be regained, etc when they are available.
 */
import { Auth } from "aws-amplify";
import ENV from "../constants/env";
import { wait } from "../helpers/wait";
import { CaseModel, Deposition, UserModel } from "../models";
import { HTTP_METHOD, ITokenSet } from "../models/general";

interface RequestParams {
    path: string;
    payload?: Record<string, any>;
    addToken?: boolean;
    method?: HTTP_METHOD;
    setContentType?: boolean;
}

export class ApiService {
    constructor(private http: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

    private apiUrl: string = ENV.API.URL;

    private tokenSet: ITokenSet;

    private httpStatusCodeRetryRegex = ENV.API.API_RETRY_REQUEST_STATUS_CODE_RANGES_REGEX;

    getTokenSet = async () => {
        const session = await Auth.currentSession();
        this.tokenSet = {
            accessToken: session.getIdToken().getJwtToken(),
            refreshToken: session.getRefreshToken().getToken(),
            accessTokenExpiryTime: session.getIdToken().getExpiration(),
        };
        return this.tokenSet.accessToken;
    };

    fetchCases = async (payload): Promise<CaseModel.ICase[]> => {
        return this.request<CaseModel.ICase[]>({ path: "/api/Cases", payload }).then(
            (cases: CaseModel.ICase[]) => cases || []
        );
    };

    createCase = async (caseData): Promise<CaseModel.ICase> => {
        return this.request<CaseModel.ICase>({
            path: "/api/Cases",
            payload: caseData,
            method: HTTP_METHOD.POST,
        });
    };

    joinDeposition = async (depositionID: string): Promise<Deposition.IDeposition> => {
        return this.request<Deposition.IDeposition>({
            path: `/api/depositions/${depositionID}/join`,
            method: HTTP_METHOD.POST,
        });
    };

    endDeposition = async (depositionID: string): Promise<Deposition.IDeposition> => {
        // TODO: Add real End Depo endpoint
        return this.request<Deposition.IDeposition>({
            path: `/api/depositions/${depositionID}/end`,
            method: HTTP_METHOD.POST,
        });
    };

    verifyUser = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: "/api/Users/verifyUser",
            payload,
            addToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    signUp = async (payload): Promise<UserModel.IUser> => {
        return this.request<UserModel.IUser>({
            path: "/api/Users",
            payload,
            addToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    verifyEmail = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: "/api/Users/resendVerificationEmail",
            payload,
            addToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    private request = async <T>({
        path,
        payload = {},
        addToken = true,
        method = HTTP_METHOD.GET,
        setContentType = true,
    }: RequestParams): Promise<T> => {
        if (addToken && !this.tokenSet) await this.getTokenSet();
        const jwt = addToken ? `Bearer ${this.tokenSet.accessToken}` : undefined;

        const queryParams =
            method === HTTP_METHOD.GET &&
            `?${Object.entries(payload)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join("&")}`;
        const body = [HTTP_METHOD.POST, HTTP_METHOD.PUT, HTTP_METHOD.PATCH].includes(method)
            ? JSON.stringify(payload)
            : undefined;
        return this.retryRequest(
            `${this.apiUrl}${path}${queryParams || ""}`,
            {
                method,
                body,
                headers: {
                    Authorization: jwt,
                    Accept: setContentType ? "application/json" : undefined,
                    "Content-Type": setContentType ? "application/json" : undefined,
                },
            },
            ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1 // One attempt and the others are the retries
        );
    };

    /*
     * retries the request if the status code obtained is one of the status that we should retry the request
     */
    private retryRequest = async <T>(
        path: string,
        options: { method: HTTP_METHOD; body?: string; headers: any },
        attemptsLeft: number
    ): Promise<T> => {
        try {
            const response = await this.http(path, options);
            const parsedResponse = response.json ? await response.json() : response.ok;
            if (!parsedResponse && options?.method === HTTP_METHOD.GET) {
                // eslint-disable-next-line no-throw-literal
                throw { json: async () => parsedResponse, status: 503 }; // going to the retry flow
            }
            return parsedResponse;
        } catch (errorResponse) {
            const error = errorResponse.status || true;
            const nextAttemptCount = attemptsLeft - 1;
            const shouldRetryBasedOnStatusCode = this.httpStatusCodeRetryRegex.test(String(errorResponse.status));
            if (shouldRetryBasedOnStatusCode) {
                if (nextAttemptCount <= 0) {
                    throw error;
                } else {
                    await wait(ENV.API.API_RETRY_REQUEST_ATTEMPT_DELAY_MS);
                    return this.retryRequest(path, options, nextAttemptCount);
                }
            }
            throw error;
        }
    };
}
