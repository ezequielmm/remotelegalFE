export const AUDIO_FORMATS = ["mp3", "ogg"];

export const isAudioFromUrl = (extension: string = "mp4") => AUDIO_FORMATS.includes(extension);
