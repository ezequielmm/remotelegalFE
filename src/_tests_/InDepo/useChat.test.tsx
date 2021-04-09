import { act, renderHook } from "@testing-library/react-hooks";
import { Client } from "@twilio/conversations";
import useChat from "../../hooks/InDepo/useChat";
import { defineProviderValues } from "../../state/GlobalState";
import { MESSAGE } from "../mocks/messages";
import state from "../mocks/state";
import getMockDeps from "../utils/getMockDeps";

jest.mock("react-router", () => ({
    ...jest.requireActual("react-router"),
    useParams: () => ({ depositionID: "test1234", breakroomID: "testBreakroom1234" }),
}));

let handleOnSendMessage;

const wrapper = ({ children }) =>
    defineProviderValues(
        {
            room: {
                currentRoom: {},
                token: "some",
            },
        },
        state.dispatch,
        getMockDeps(),
        children
    );

beforeEach(() => {
    Client.create = jest.fn().mockResolvedValue({
        getConversationByUniqueName: jest.fn().mockResolvedValue({
            sendMessage: jest.fn(),
            getMessages: jest.fn().mockResolvedValue({
                items: [],
            }),
        }),
        on: (action, cb) => {
            handleOnSendMessage = cb;
        },
        off: jest.fn(),
    });
});

test("it should receive 2 messages on initialization", async () => {
    Client.create = jest.fn().mockResolvedValue({
        getConversationByUniqueName: jest.fn().mockResolvedValue({
            sendMessage: jest.fn(),
            getMessages: jest.fn().mockResolvedValue({
                items: [MESSAGE],
            }),
        }),
        on: (action, cb) => {
            handleOnSendMessage = cb;
        },
        off: jest.fn(),
    });
    let result;
    await act(async () => {
        const hook = renderHook(() => useChat({ chatOpen: true, setUnreadedChats: () => {}, unreadedChats: 0 }), {
            wrapper,
        });
        result = hook.result;
    });

    expect(result.current.messages).toHaveLength(1);
});

test("It should receive no messages on initialization", async () => {
    let result;
    await act(async () => {
        const hook = renderHook(() => useChat({ chatOpen: true, setUnreadedChats: () => {}, unreadedChats: 0 }), {
            wrapper,
        });
        result = hook.result;
    });

    expect(result.current.messages).toHaveLength(0);
});

test("It should trigger an error ", async () => {
    Client.create = jest.fn().mockRejectedValue(true);

    let result;
    await act(async () => {
        const hook = renderHook(() => useChat({ chatOpen: true, setUnreadedChats: () => {}, unreadedChats: 0 }), {
            wrapper,
        });
        result = hook.result;
    });
    expect(result.current.errorLoadingClient).toBeTruthy();
});

test("It should receive one message", async () => {
    let result;
    await act(async () => {
        const hook = renderHook(() => useChat({ chatOpen: true, setUnreadedChats: jest.fn(), unreadedChats: 0 }), {
            wrapper,
        });
        result = hook.result;
    });
    await act(async () => {
        handleOnSendMessage(MESSAGE);
    });
    expect(result.current.messages).toHaveLength(1);
});

test("It should receive one failed message", async () => {
    Client.create = jest.fn().mockResolvedValue({
        getConversationByUniqueName: jest.fn().mockResolvedValue({
            sendMessage: jest.fn().mockRejectedValue(false),
            getMessages: jest.fn().mockResolvedValue({
                items: [],
            }),
        }),
        on: (action, cb) => {
            handleOnSendMessage = cb;
        },
        off: jest.fn(),
    });
    let result;
    await act(async () => {
        const hook = renderHook(() => useChat({ chatOpen: true, setUnreadedChats: jest.fn(), unreadedChats: 0 }), {
            wrapper,
        });
        result = hook.result;
    });
    await act(async () => {
        result.current.sendMessage("text");
    });
    expect(result.current.messages[0].failed).toBeTruthy();
});

test("It should set unreadedChat to 0 when chat is open", async () => {
    const setUnreadedChats = jest.fn();
    await act(async () => {
        renderHook(() => useChat({ chatOpen: true, setUnreadedChats, unreadedChats: 2 }), {
            wrapper,
        });
    });
    expect(setUnreadedChats).toBeCalledWith(0);
});

test("It should add an unreadedChat when chat is not open", async () => {
    const setUnreadedChats = jest.fn();
    const unreadedChats = 0;
    await act(async () => {
        renderHook(() => useChat({ chatOpen: false, setUnreadedChats, unreadedChats }), {
            wrapper,
        });
    });
    await act(async () => {
        handleOnSendMessage(MESSAGE);
    });
    expect(setUnreadedChats).toBeCalledWith(unreadedChats + 1);
});

test("It should not add an unreadedChat when chat is open", async () => {
    const setUnreadedChats = jest.fn();
    const unreadedChats = 0;
    await act(async () => {
        renderHook(() => useChat({ chatOpen: true, setUnreadedChats, unreadedChats }), {
            wrapper,
        });
    });
    await act(async () => {
        handleOnSendMessage(MESSAGE);
    });
    expect(setUnreadedChats).not.toBeCalledWith(unreadedChats + 1);
});
