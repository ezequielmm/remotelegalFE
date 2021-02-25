export const secondsTohhmmss = (seconds: number = 0) => new Date(seconds * 1000).toISOString().substr(11, 8);
