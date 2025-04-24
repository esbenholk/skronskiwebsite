import React, { useState, useRef } from "react";
import urlFor from "../functions/urlFor";

import ReactPlayer from "react-player";

const VideoPlayer = ({ url, thumbnail }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const isMobile = window.innerWidth < 768;

  const isYouTube = ReactPlayer.canPlay(url) && url.includes("youtube");

  const aspectRatio = isYouTube ? 4 / 3 : 16 / 9;

  const width = isMobile
    ? window.innerWidth - 30
    : window.innerWidth - 200 - 60;

  const height =
    width / aspectRatio < window.innerHeight - 200
      ? width / aspectRatio
      : window.innerHeight - 200;

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  return (
    <div
      style={{
        position: "relative",
        width: width,
        height: height,
        // paddingTop,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: width,
          height: height,
        }}
      >
        <ReactPlayer
          ref={playerRef}
          url={url}
          playing={playing}
          controls={true}
          width={width}
          height={height}
          onPlay={handlePlay}
          onPause={handlePause}
        />
        {!playing && thumbnail != null && (
          <div
            onClick={() => setPlaying(true)}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${urlFor(thumbnail.asset)})`,
              backgroundSize: "cover",
              backgroundPosition: "center",

              zIndex: 1,
            }}
            className="thumbnail"
          >
            <div className="playButton">
              <p>play button</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
