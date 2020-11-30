import { ApiService } from "../../services/ApiService";
import { HTTP_METHOD, ITokenSet } from "../../models/general";
import ENV from "../../constants/env";
import { wait } from "../../helpers/wait";
import * as AUTH from "../mocks/Auth";

describe("ApiService", () => {
    let apiService: ApiService;
    let fetch: any;
    let url: string;
    let payload: any;

    beforeEach(() => {
        url = "/url";
        payload = { a: 1, b: 2 };
        fetch = jest.fn().mockResolvedValue({ status: 200, json: () => Promise.resolve({ value: { a: 1 } }) });
        apiService = new ApiService(fetch);
    });

    it("should make a GET request", async () => {
        (apiService as any).request({ path: url, addToken: false, payload });
        await wait(0);
        expect(fetch).toBeCalledWith(`${ENV.API.URL}${url}?a=1&b=2`, {
            method: HTTP_METHOD.GET,
            payload: undefined,
            headers: expect.any(Object),
        });
    });

    it("should make a POST request", async () => {
        (apiService as any).request({ path: url, addToken: false, payload, method: HTTP_METHOD.POST });
        await wait(0);
        expect(fetch).toBeCalledWith(`${ENV.API.URL}${url}`, {
            method: HTTP_METHOD.POST,
            body: JSON.stringify(payload),
            headers: expect.any(Object),
        });
    });

    it("should make a PUT request", async () => {
        (apiService as any).request({ path: url, addToken: false, payload, method: HTTP_METHOD.PUT });
        await wait(0);
        expect(fetch).toBeCalledWith(`${ENV.API.URL}${url}`, {
            method: HTTP_METHOD.PUT,
            body: JSON.stringify(payload),
            headers: expect.any(Object),
        });
    });

    it("should make a PATCH request", async () => {
        (apiService as any).request({ path: url, addToken: false, payload, method: HTTP_METHOD.PATCH });
        await wait(0);
        expect(fetch).toBeCalledWith(`${ENV.API.URL}${url}`, {
            method: HTTP_METHOD.PATCH,
            body: JSON.stringify(payload),
            headers: expect.any(Object),
        });
    });

    it("should make a DELETE request", async () => {
        (apiService as any).request({ path: url, addToken: false, payload, method: HTTP_METHOD.DELETE });
        await wait(0);
        expect(fetch).toBeCalledWith(`${ENV.API.URL}${url}`, {
            method: HTTP_METHOD.DELETE,
            body: undefined,
            headers: expect.any(Object),
        });
    });

    it("should set a token set", async () => {
        AUTH.VALID_WITH_REFRESH();
        expect((apiService as any).tokenSet).toBeFalsy();
        await apiService.getTokenSet();
        expect((apiService as any).tokenSet).toEqual(AUTH.TOKEN_SET);
    });
    describe("retry logic", () => {
        it("should NOT retry if the server responds with a status code that does NOT exist in the range of status codes that need retry", async () => {
            fetch = jest.fn().mockResolvedValue({ status: 200, json: () => Promise.resolve({ value: { a: 1 } }) });
            apiService = new ApiService(fetch);
            await (apiService as any).request({ path: url, payload, addToken: false });
            expect(fetch).toBeCalledTimes(1);
        });
        it(`should retry ${ENV.API.API_RETRY_REQUEST_ATTEMPTS} times if the server responds a status code that exists in the range of status codes that need retry`, async () => {
            fetch = jest.fn().mockRejectedValue({ status: 503, json: () => Promise.resolve({ value: { a: 1 } }) });
            apiService = new ApiService(fetch);
            try {
                await (apiService as any).request({ path: url, payload, addToken: false });
            } catch {
                expect(fetch).toBeCalledTimes(ENV.API.API_RETRY_REQUEST_ATTEMPTS + 1); // add 1 for the first attempt
            }
        });
    });
});
