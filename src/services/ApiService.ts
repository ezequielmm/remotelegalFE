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
import { datadogLogs } from "@datadog/browser-logs";
import ENV from "../constants/env";
import { wait } from "../helpers/wait";
import { EventModel, CaseModel, DepositionModel, UserModel, ParticipantModel, ExhibitsModel } from "../models";
import { HTTP_METHOD, ITokenSet } from "../models/general";
import TEMP_TOKEN from "../constants/ApiService";
import getBrowserInfo from "../helpers/browserInfo";

interface RequestParams {
    path: string;
    payload?: Record<string, any>;
    withToken?: boolean;
    method?: HTTP_METHOD;
    withContentType?: boolean;
    formData?: FormData;
    basePath?: string;
}

export class ApiService {
    constructor(private http: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

    private apiUrl: string = ENV.API.URL;

    private tokenSet: ITokenSet;

    private httpStatusCodeRetryRegex = ENV.API.API_RETRY_REQUEST_STATUS_CODE_RANGES_REGEX;

    getTokenSet = async () => {
        const currentTime = Math.round(+new Date() / 1000);
        const tempToken = localStorage.getItem(TEMP_TOKEN);
        if (tempToken) {
            this.tokenSet = {
                accessToken: tempToken,
                refreshToken: null,
                accessTokenExpiryTime: null,
            };
            return this.tokenSet.accessToken;
        }
        if (!this.tokenSet || this.tokenSet.accessTokenExpiryTime < currentTime) {
            const session = await Auth.currentSession();
            this.tokenSet = {
                accessToken: session.getIdToken().getJwtToken(),
                refreshToken: session.getRefreshToken().getToken(),
                accessTokenExpiryTime: session.getIdToken().getExpiration(),
            };
        }
        return this.tokenSet.accessToken;
    };

    currentUser = async (): Promise<UserModel.IUser> => {
        return this.request<UserModel.IUser>({ path: "/api/Users/currentUser" });
    };

    fetchCases = async (payload): Promise<CaseModel.ICase[]> => {
        return this.request<CaseModel.ICase[]>({ path: "/api/Cases", payload }).then(
            (cases: CaseModel.ICase[]) => cases || []
        );
    };

    fetchDepositions = async (payload): Promise<DepositionModel.IDeposition[]> => {
        return this.request<DepositionModel.IDeposition[]>({ path: "/api/Depositions", payload }).then(
            (deposition: DepositionModel.IDeposition[]) => deposition || []
        );
    };

    fetchDeposition = async (depositionID: string): Promise<DepositionModel.IDeposition> => {
        return this.request<DepositionModel.IDeposition>({ path: `/api/depositions/${depositionID}` });
    };

    createCase = async (caseData): Promise<CaseModel.ICase> => {
        return this.request<CaseModel.ICase>({
            path: "/api/Cases",
            payload: caseData,
            method: HTTP_METHOD.POST,
        });
    };

    editCase = async (caseData): Promise<CaseModel.ICase> => {
        return this.request<CaseModel.ICase>({
            path: `/api/Cases/${caseData.id}`,
            payload: caseData.caseObj,
            method: HTTP_METHOD.PUT,
        });
    };

    getDepositionPermissions = async (depositionID: string) => {
        return this.request<DepositionModel.IDeposition>({
            path: `/api/permissions/depositions/${depositionID}`,
            method: HTTP_METHOD.GET,
        });
    };

    getDepositionInfo = async (depositionID: string) => {
        return this.request<DepositionModel.IDeposition>({
            path: `/api/depositions/${depositionID}/info`,
            method: HTTP_METHOD.GET,
        });
    };

    getDepositionTranscriptions = async (depositionID: string) => {
        return this.request<DepositionModel.IDeposition>({
            basePath: process.env.REACT_APP_TRANSCRIPT_API_URL,
            path: `/transcriptions/${depositionID}`,
            method: HTTP_METHOD.GET,
        });
    };

    getDepositionTranscriptionsWithOffsets = async (depositionID: string) => {
        return this.request<DepositionModel.IDeposition>({
            basePath: process.env.REACT_APP_TRANSCRIPT_API_URL,
            path: `/transcriptions/${depositionID}/offsets`,
            method: HTTP_METHOD.GET,
        });
    };

    getDepositionBreakrooms = async (depositionID: string): Promise<DepositionModel.DepositionPermissions> => {
        return this.request({
            path: `/api/depositions/${depositionID}/breakrooms`,
            method: HTTP_METHOD.GET,
        });
    };

    getDepositionEvents = async (depositionID: string) => {
        return this.request<EventModel.IEvent>({
            path: `/api/depositions/${depositionID}/events`,
            method: HTTP_METHOD.GET,
        });
    };

    joinDeposition = async (depositionID: string): Promise<DepositionModel.DepositionPermissions> => {
        return this.request({
            path: `/api/depositions/${depositionID}/join`,
            withContentType: true,
            method: HTTP_METHOD.POST,
        });
    };

    joinBreakroom = async (
        depositionID: string,
        breakroomId: string
    ): Promise<DepositionModel.DepositionPermissions> => {
        return this.request({
            path: `/api/depositions/${depositionID}/breakrooms/${breakroomId}/join`,
            method: HTTP_METHOD.POST,
        });
    };

    recordDeposition = async (depositionID: string, onRecord: boolean) => {
        return this.request<DepositionModel.IDeposition>({
            path: `/api/depositions/${depositionID}/record?onTheRecord=${onRecord}`,
            method: HTTP_METHOD.POST,
        });
    };

    endDeposition = async (depositionID: string) => {
        return this.request<DepositionModel.IDeposition>({
            path: `/api/depositions/${depositionID}/end`,
            method: HTTP_METHOD.POST,
        });
    };

    editDeposition = async (depoID: string, data, file?, deleteCaption?) => {
        const formData = new FormData();
        if (file) {
            formData.append(file.uid, file);
        }
        formData.set("json", JSON.stringify({ deposition: data, deleteCaption }));

        return this.request<boolean>({
            path: `/api/depositions/${depoID}`,
            formData,
            withContentType: false,
            method: HTTP_METHOD.PATCH,
        });
    };

    rescheduleDeposition = async (depoID: string, data, file?, deleteCaption?) => {
        const formData = new FormData();
        if (file) {
            formData.append(file.uid, file);
        }
        formData.set("json", JSON.stringify({ deposition: data, deleteCaption }));

        return this.request<boolean>({
            path: `/api/depositions/${depoID}/reschedule`,
            formData,
            withContentType: false,
            method: HTTP_METHOD.POST,
        });
    };

    revertCancelDeposition = async (depoID: string, data, file?, deleteCaption?) => {
        const formData = new FormData();
        if (file) {
            formData.append(file.uid, file);
        }
        formData.set("json", JSON.stringify({ deposition: data, deleteCaption }));

        return this.request<boolean>({
            path: `/api/depositions/${depoID}/revertCancel`,
            formData,
            withContentType: false,
            method: HTTP_METHOD.POST,
        });
    };

    cancelDeposition = async (depoID: string) => {
        return this.request<boolean>({
            path: `/api/depositions/${depoID}/cancel`,
            method: HTTP_METHOD.POST,
        });
    };

    createDepositions = async ({ depositionList, files, caseId }) => {
        const formData = new FormData();
        files.forEach((file) => {
            formData.append(file.uid, file);
        });
        formData.set("json", JSON.stringify({ depositions: depositionList }));
        return this.request<boolean>({
            path: `/api/Cases/${caseId}`,
            formData,
            withContentType: false,
            method: HTTP_METHOD.PATCH,
        });
    };

    verifyUser = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: "/api/Users/verifyUser",
            payload,
            withToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    verifyPasswordToken = async (payload): Promise<{ email: string }> => {
        return this.request<{ email: string }>({
            path: "/api/Users/verifyPasswordToken",
            payload,
            withToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    checkUserDepoStatus = async (depositionID: string, email: string): Promise<UserModel.UserInfo> => {
        return this.request({
            path: `/api/Depositions/${depositionID}/checkParticipant?emailAddress=${encodeURIComponent(email)}`,
            withToken: false,
            method: HTTP_METHOD.GET,
        });
    };

    registerGuestDepoParticipant = async (depositionId: string, rest) => {
        const { browser, device } = getBrowserInfo();
        const payload = { browser, device, ...rest };
        return this.request({
            path: `/api/Depositions/${depositionId}/addGuestParticipant`,
            payload,
            withToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    sendUserSystemInfo = async (depositionID: string) => {
        const payload = getBrowserInfo();
        return this.request({
            path: `/api/depositions/${depositionID}/userSystemInfo`,
            method: HTTP_METHOD.POST,
            payload,
        });
    };

    sendParticipantDevices = async (depositionID: string, payload) => {
        return this.request({
            path: `/api/depositions/${depositionID}/devices`,
            method: HTTP_METHOD.POST,
            payload,
        });
    };

    addDepoParticipant = async (depositionID: string, payload) => {
        return this.request({
            path: `/api/Depositions/${depositionID}/addParticipant`,
            payload,
            method: HTTP_METHOD.POST,
        });
    };

    editDepoParticipant = async (depositionID: string, payload) => {
        return this.request({
            path: `/api/Depositions/${depositionID}/editParticipant`,
            payload,
            method: HTTP_METHOD.PATCH,
        });
    };

    changePassword = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: "/api/Users/changePassword",
            payload,
            withToken: false,
            method: HTTP_METHOD.PUT,
        });
    };

    forgotPassword = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: "/api/Users/forgotPassword",
            payload,
            withToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    signUp = async (payload): Promise<UserModel.IUser> => {
        return this.request<UserModel.IUser>({
            path: "/api/Users",
            payload,
            withToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    verifyEmail = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: "/api/Users/resendVerificationEmail",
            payload,
            withToken: false,
            method: HTTP_METHOD.POST,
        });
    };

    joinResponse = async (depositionID: string, participantId: string, isAdmitted: boolean) => {
        return this.request({
            path: `/api/Depositions/${depositionID}/joinResponse/${participantId}`,
            withToken: true,
            payload: { isAdmitted },
            method: HTTP_METHOD.POST,
        });
    };

    notifyParticipantPresence = async ({ depositionID, isMuted }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/notifyParticipantPresence`,
            payload: { isMuted },
            withToken: true,
            method: HTTP_METHOD.PUT,
        });
    };

    waitingRoomParticipants = async (depositionID: string): Promise<ParticipantModel.IParticipant[]> => {
        return this.request({
            path: `/api/Depositions/${depositionID}/waitingRoomParticipants`,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    fetchDepositionsFiles = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/MyExhibits`,
            payload,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    fetchCaption = async (depositionID: string) => {
        return this.request({
            path: `/api/depositions/${depositionID}/caption`,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    fetchParticipants = async (depoID: string, payload): Promise<ParticipantModel.IParticipant[]> => {
        return this.request({
            path: `/api/Depositions/${depoID}/participants`,
            payload,
        }).then((participants: ParticipantModel.IParticipant[]) => participants || []);
    };

    addParticipantToExistingDepo = async (depositionID: string, payload) => {
        return this.request({
            path: `/api/depositions/${depositionID}/participants`,
            payload,
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    removeParticipantFromExistingDepo = async (depositionID: string, participantID: string) => {
        return this.request({
            path: `/api/depositions/${depositionID}/participants/${participantID}`,
            withToken: true,
            method: HTTP_METHOD.DELETE,
        });
    };

    fetchTranscriptsFiles = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            basePath: process.env.REACT_APP_TRANSCRIPT_API_URL,
            path: `/Transcriptions/${depositionID}/Files`,
            payload,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    getSignedUrl = async ({ depositionID, documentId }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/depositions/${depositionID}/documents/${documentId}/preSignedUrl`,
            payload: {},
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    getPrivateSignedUrl = async ({ documentId }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/documents/${documentId}/preSignedUrl`,
            payload: {},
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    shareExhibit = async ({ depositionId, documentId, readOnly }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/depositions/${depositionId}/documents/${documentId}/Share`,
            payload: { readOnly },
            withToken: true,
            method: HTTP_METHOD.PUT,
        });
    };

    getSharedExhibit = async (payload): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${payload}/SharedDocument`,
            payload: {},
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    closeStampedExhibit = async ({ depositionID, stampLabel, blob }): Promise<boolean> => {
        const formData = new FormData();
        formData.append("blob", blob as Blob);
        formData.set("json", JSON.stringify({ stampLabel }));
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/SharedDocument/CloseStamped`,
            formData,
            withContentType: false,
            method: HTTP_METHOD.POST,
        });
    };

    closeExhibit = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/SharedDocument/Close`,
            payload,
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    getAnnotations = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/SharedDocument/annotations`,
            payload,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    sendAnnotation = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/SharedDocument/annotate`,
            payload,
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    getEnteredExhibits = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/EnteredExhibits`,
            payload,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    getRecordingInfo = async ({ depositionID, ...payload }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/video`,
            payload,
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    getDocumentsUrlList = async ({ depositionID, documentIds }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/documents/PreSignedUrl?documentIds=${documentIds.join(
                "&documentIds="
            )}`,
            withContentType: true,
            method: HTTP_METHOD.GET,
        });
    };

    preSignUploadExhibit = (
        payload: ExhibitsModel.IPayloadPreSignUploadExhibit
    ): Promise<ExhibitsModel.IPreSignUploadExhibit> => {
        return this.request({
            path: "/api/documents/PreSignUploadExhibit",
            payload,
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    deleteExhibit = async ({ depositionID, documentId }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/documents/${documentId}`,
            payload: {},
            withToken: true,
            method: HTTP_METHOD.DELETE,
        });
    };

    removeTranscript = async (depositionID: string, transcriptID: string) => {
        return this.request({
            path: `/api/depositions/${depositionID}/transcripts/${transcriptID}`,
            withToken: true,
            method: HTTP_METHOD.DELETE,
        });
    };

    setParticipantStatus = async ({ depositionID, isMuted }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/participantStatus`,
            payload: { isMuted },
            withToken: true,
            method: HTTP_METHOD.PUT,
        });
    };

    lockRoom = async ({ depositionID, breakroomID, isLock }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/breakrooms/${breakroomID}/lock?lockRoom=${isLock}`,
            payload: {},
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    bringAllToMe = async ({ depositionID, page }): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/Depositions/${depositionID}/BringAllToMe`,
            payload: { documentLocation: page },
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    notifyParties = async (depositionID: string) => {
        return this.request({
            path: `/api/depositions/${depositionID}/notifyParties`,
            withToken: true,
            method: HTTP_METHOD.POST,
        });
    };

    frontEndContent = async () => {
        return this.request({
            path: `/api/Documents/FrontendContent`,
            withToken: false,
            method: HTTP_METHOD.GET,
        });
    };

    getSystemSettings = async () => {
        return this.request({
            path: `/api/systemsettings`,
            withToken: false,
            method: HTTP_METHOD.GET,
        });
    };

    getDepoSummaryInfo = async (depositionID: string): Promise<boolean> => {
        return this.request<boolean>({
            path: `/api/depositions/${depositionID}/summary`,
            payload: {},
            withToken: true,
            method: HTTP_METHOD.GET,
        });
    };

    private request = async <T>({
        path,
        payload = {},
        withToken = true,
        method = HTTP_METHOD.GET,
        withContentType = true,
        formData = undefined,
        basePath = this.apiUrl,
    }: RequestParams): Promise<T> => {
        if (withToken) await this.getTokenSet();
        const jwt = withToken ? `Bearer ${this.tokenSet.accessToken}` : undefined;
        const queryParams =
            Object.entries(payload).length &&
            method === HTTP_METHOD.GET &&
            `?${Object.entries(payload)
                .filter(([, value]) => value !== undefined)
                .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
                .join("&")}`;
        const body =
            [HTTP_METHOD.POST, HTTP_METHOD.PUT, HTTP_METHOD.PATCH].includes(method) && !formData
                ? JSON.stringify(payload)
                : formData;
        const contentType = withContentType ? { Accept: "application/json", "Content-Type": "application/json" } : {};
        return this.retryRequest(
            `${basePath}${path}${queryParams || ""}`,
            {
                method,
                body,
                headers: {
                    Authorization: jwt,
                    ...contentType,
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
        options: { method: HTTP_METHOD; body?: string | FormData; headers: any },
        attemptsLeft: number
    ): Promise<T> => {
        try {
            const response = await this.http(path, options);
            const contentType = response.headers.get("content-type");
            const parsedResponse =
                contentType && contentType.includes("application/json") ? await response.json() : await response.text();
            if (!parsedResponse && options?.method === HTTP_METHOD.GET) {
                // eslint-disable-next-line no-throw-literal
                throw { json: async () => parsedResponse, status: 503 }; // going to the retry flow
            }
            return parsedResponse;
        } catch (errorResponse) {
            this.logFetchError(errorResponse);
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

    private logFetchError = async (errorResponse: Response) => {
        try {
            const stackTrace = await this.getErrorFromResponse(errorResponse);
            datadogLogs.logger.error(`ApiService fetch error`, {
                errorStatus: errorResponse?.status || "",
                errorMessage: errorResponse?.statusText || "",
                stackTrace,
            });
        } catch (error) {
            console.error("logFetchError", error);
        }
    };

    private getErrorFromResponse = (errorResponse) => {
        if (!errorResponse.body) return null;
        const reader = errorResponse.body.getReader();
        let error = null;
        const getError = async () => {
            const { value, done } = await reader.read();
            if (done) {
                return error;
            }
            if (value && value?.buffer instanceof ArrayBuffer) error = JSON.parse(new TextDecoder().decode(value));
            return getError();
        };
        return getError();
    };
}
