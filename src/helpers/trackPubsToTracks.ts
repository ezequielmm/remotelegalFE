const trackpubsToTracks = (trackMap) =>
    Array.from(trackMap.values())
        // @ts-ignore
        .map((publication) => publication.track)
        .filter((track) => track !== null);

export default trackpubsToTracks;
