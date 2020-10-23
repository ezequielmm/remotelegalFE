import React, { useEffect, useRef, useState } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";
import { Button } from "antd";
import styled from "styled-components";

const ParticipantContainer = styled.div<{ isLocalParticipant: boolean }>`
    position: relative;
    overflow: hidden;
    text-align: center;
    video {
        height: ${ ({isLocalParticipant}) => isLocalParticipant ? "70vh": "20vh" }
    }
    
`;

const Identity = styled.div`
    color: white;
    position: absolute;
    bottom: 30px;
    left: 0;
    right: 0;
`;
const Mute = styled(Button)`
    display: block;
    margin: 5px auto;
`;

const Participant = ({
    participant,
    isLocalParticipant,
    showAudioControl,
}: {
    participant: LocalParticipant | RemoteParticipant;
    isLocalParticipant?: boolean;
    showAudioControl?: boolean;
}) => {
    const [videoTracks, setVideoTracks] = useState([]);
    const [audioTracks, setAudioTracks] = useState([]);
    const [isMuted, setIsMuted] = useState(false);

    const videoRef = useRef();
    const audioRef = useRef();

    const trackpubsToTracks = (trackMap) =>
        Array.from(trackMap.values())
            // @ts-ignore
            .map((publication) => publication.track)
            .filter((track) => track !== null);

    useEffect(() => {
        setVideoTracks(trackpubsToTracks(participant.videoTracks));
        setAudioTracks(trackpubsToTracks(participant.audioTracks));

        const trackSubscribed = (track) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => [...videoTracks, track]);
            } else if (track.kind === "audio") {
                setAudioTracks((audioTracks) => [...audioTracks, track]);
            }
        };

        const trackUnsubscribed = (track) => {
            if (track.kind === "video") {
                setVideoTracks((videoTracks) => videoTracks.filter((v) => v !== track));
            } else if (track.kind === "audio") {
                setAudioTracks((audioTracks) => audioTracks.filter((a) => a !== track));
            }
        };

        participant.on("trackSubscribed", trackSubscribed);
        participant.on("trackUnsubscribed", trackUnsubscribed);

        return () => {
            setVideoTracks([]);
            setAudioTracks([]);
            participant.removeAllListeners();
        };
    }, [participant]);

    useEffect(() => {
        const videoTrack = videoTracks[0];
        if (videoTrack) {
            videoTrack.attach(videoRef.current);
            return () => {
                videoTrack.detach();
            };
        }
    }, [videoTracks]);

    useEffect(() => {
        const audioTrack = audioTracks[0];
        if (audioTrack) {
            audioTrack.attach(audioRef.current);
            return () => {
                audioTrack.detach();
            };
        }
    }, [audioTracks]);

    useEffect(() => {
        if (showAudioControl) {
            audioTracks.forEach((audioTrack) => {
                isMuted && audioTrack.isEnabled ? audioTrack.disable() : audioTrack.enable();
            });
        }
    }, [isMuted, audioTracks, showAudioControl]);

    const audioText = isMuted ? "Audio disabled" : "Audio enabled";
    return (
        <ParticipantContainer isLocalParticipant={isLocalParticipant}>
            <video ref={videoRef} autoPlay={true} />
            <audio ref={audioRef} autoPlay={true} />
            {showAudioControl && <Mute onClick={() => setIsMuted(!isMuted)}>{audioText}</Mute>}
            <Identity>{participant.identity}</Identity>
        </ParticipantContainer>
    );
};

export default Participant;
