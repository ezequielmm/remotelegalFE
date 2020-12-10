import { hexToRGBA } from "../../constants/styles/utils";

describe("hexToRGBA", () => {
    it("should get rgba without defined alpha", () => {
        expect(hexToRGBA("#0080FF80")).toEqual("rgba(0, 128, 255, 0.5019607843137255)");
    });

    it("should get rgba with short HEX", () => {
        expect(hexToRGBA("#06C")).toEqual("rgba(0, 102, 204, 1)");
    });

    it("should get rgba with defined alpha", () => {
        expect(hexToRGBA("#0066CC", 0.45)).toEqual("rgba(0, 102, 204, 0.45)");
    });

    it("should get 'Invalid HEX' if not a valid HEX ", () => {
        expect(hexToRGBA("13")).toEqual("Invalid HEX");
    });
});
