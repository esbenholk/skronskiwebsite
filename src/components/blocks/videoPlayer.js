import React, { useState, useRef, useMemo } from "react";
import urlFor from "../functions/urlFor";
import SVG from "react-inlinesvg";

import ReactPlayer from "react-player";
import AppContext from "../../globalState";
import { useContext } from "react";

const VideoPlayer = ({ url, thumbnail }) => {
  const [playing, setPlaying] = useState(false);
  const playerRef = useRef(null);

  const myContext = useContext(AppContext);

  const detailSvgs = myContext.playButtons;

  const randomDetail = useMemo(() => {
    if (detailSvgs.length === 0) return null;
    const index = Math.floor(Math.random() * detailSvgs.length);
    return detailSvgs[index];
    // eslint-disable-next-line
  }, []);

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
              <SVG
                src={"/frames/icons/" + randomDetail}
                style={{ width: "100%", height: "100%", display: "block" }}
                preProcessor={(code) =>
                  code.replace(/<svg/, '<svg preserveAspectRatio="none"')
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
