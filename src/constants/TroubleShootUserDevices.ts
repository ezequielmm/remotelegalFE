export const TITLE = "Everything ready?";
export const IN_DEPO_TITLE = "Settings";
export const SPEAKER_TEST_LABEL = "TEST SPEAKER";
export const JOIN_BUTTON_LABEL = "Join Now";
export const CHANGE_DEVICES_LABEL = "Done";
export const INVALID_VALUES = ["-", ""];
export const CAMERA_BLOCKED_ERROR_MESSAGES = {
    title: "Camera blocked",
    subtitle: "Please allow the browser´s permissions to access the camera",
};
export const NETWORK_ERROR = "There was an error joining the deposition, please try again";
export const CAMERA_UNAVAILABLE_ERROR_MESSAGES = {
    title: "Camera not available",
    subtitle:
        "We are not able to access your camera. You can still join the deposition, but no one else will see you until you enable your camera.",
};
export enum DevicesStatus {
    unavailable = "unavailable",
    blocked = "blocked",
    enabled = "enabled",
}
