import changeSpeakers from "../../helpers/changeSpeakers";

test("it calls setSinkId of element with deviceId", () => {
    const element = {
        setSinkId: jest.fn(),
        id: "12345",
    };
    changeSpeakers(element, element.id);
    expect(element.setSinkId).toHaveBeenCalledWith(element.id);
});
