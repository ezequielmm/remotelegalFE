import { Auth } from "aws-amplify";

const generateToken = async (roomName: string) => {
    // TODO: CONNECT NEW ENDPOINT, ADD DEPENDENCY INJECTION FOR THE TOKEN AND MOVE THIS API CALL ELSEWHERE
    const session = await Auth.currentSession();
    const idToken = session.getIdToken();
    const jwt = idToken.getJwtToken();

    const requestOptions = {
        method: "POST",
        headers: {
            Authorization: `Bearer ${jwt}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: roomName }),
    };
    const tokenResponse = await fetch(`${process.env.REACT_APP_BASE_BE_URL}/api/rooms/token`, requestOptions);
    return tokenResponse.json();
};
export default generateToken;
