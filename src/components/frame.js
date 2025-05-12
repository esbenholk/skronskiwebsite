import React, { useMemo, useState, useEffect } from "react";
import SVG from "react-inlinesvg";
import urlFor from "./functions/urlFor";
import { motion } from "framer-motion";
import useWindowDimensions from "./functions/useWindowDimensions";

const Frame = () => {
  const frameSvgs = [
    "/frames/cubeframe.svg",
    "/frames/cubeframe1.svg",
    "/frames/starframe.svg",
  ];

  const randomSvg = useMemo(() => {
    if (frameSvgs.length === 0) return null;
    const index = Math.floor(Math.random() * frameSvgs.length);
    return frameSvgs[index];
    // eslint-disable-next-line
  }, []);

  if (!randomSvg) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%,-50%)",
        width: "110%",
        height: "110%",
        pointerEvents: "none",
        objectFit: "cover",
        zIndex: 1,
      }}
    >
      <SVG
        src={process.env.PUBLIC_URL + randomSvg}
        style={{ width: "100%", height: "100%", display: "block" }}
        preProcessor={(code) =>
          code.replace(/<svg/, '<svg preserveAspectRatio="none"')
        }
      />
    </div>
  );
};

export default Frame;

export const Detail = () => {
  const { width } = useWindowDimensions();
  const detailSvgs = [
    "arrow.svg",
    "banana.svg",
    "berry.svg",
    "bubbles.svg",

    "circle.svg",
    "doodle.svg",
    "dragtosee.svg",
    "fire.svg",
    "fire2.svg",
    "fire3.svg",
    "flower.svg",
    "flower1.svg",
    "flower2.svg",
    "flower3.svg",
    "flowerface.svg",
    "flowers.svg",
    "frame.svg",
    "heart.svg",
    "heart10.svg",
    "heart2.svg",
    "heart20.svg",
    "heart3.svg",
    "heart30.svg",
    "heartCubes.svg",
    "hearts1.svg",
    "heartSquiggle.svg",
    "match.svg",

    "popUp.svg",
    "smiley.svg",
    "smiley10.svg",
    "smiley2.svg",
    "smiley20.svg",
    "smiley30.svg",
    "smiley4.svg",
    "squiggle.svg",
    "squiigle.svg",
    "star.svg",
    "star10.svg",
    "star2.svg",
    "star20.svg",
    "star3.svg",
    "star30.svg",
    "star4.svg",
    "stars.svg",
    "stars2.svg",
    "strawberry.svg",
    "tabtosee.svg",
    "tomato.svg",
  ];

  const randomDetail = useMemo(() => {
    if (detailSvgs.length === 0) return null;
    const index = Math.floor(Math.random() * detailSvgs.length);
    return detailSvgs[index];
    // eslint-disable-next-line
  }, []);

  const { x, y } = useMemo(() => {
    const pickEdgeValue = () =>
      Math.random() < 0.5 ? Math.random() * 5 : 95 + Math.random() * 5;
    return {
      x: pickEdgeValue(),
      y: pickEdgeValue(),
    };
  }, []);

  const size = useMemo(() => {
    return width > 786 ? 70 + Math.random() * 150 : 30 + Math.random() * 10;
    // eslint-disable-next-line
  }, []);

  if (!randomDetail) return null;

  return (
    <div
      style={{
        position: "absolute",
        top: `${y}%`,
        left: `${x}%`,
        width: `${size}px`,
        height: "auto",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      <SVG
        src={"/frames/icons/" + randomDetail}
        style={{ width: "100%", height: "100%", display: "block" }}
        preProcessor={(code) =>
          code.replace(/<svg/, '<svg preserveAspectRatio="none"')
        }
      />
    </div>
  );
};

export const Stickers = ({ stickerArray }) => {
  const [tempstickers, setStickers] = useState([]);
  const { width } = useWindowDimensions();
  //   const { scrollYProgress } = useScroll();

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(() => {
    if (!stickerArray || stickerArray.length === 0) return;

    const selected = [...stickerArray]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((item, index) => {
        const size =
          width > 786 ? getRandomInt(100, 300) : getRandomInt(70, 150); // px
        const imgUrl = urlFor(item.asset).width(size).url();

        return {
          id: index,
          url: imgUrl,
          top: getRandomInt(0, 90), // percent
          left: getRandomInt(0, 90), // percent
          size,
        };
      });

    setStickers(selected);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {tempstickers.map((sticker, index) => (
        <motion.div
          key={index}
          style={{
            position: "absolute",
            top: `${sticker.top}%`,
            left: `${sticker.left}%`,
            width: `${sticker.size}px`,
            height: `${sticker.size}px`,
            pointerEvents: "none",
            zIndex: 1,
            // transform: `translate(${scrollYProgress * 100}, 0)`,

            // scaleX: scrollYProgress,
            // scaleY: scrollYProgress,
          }}
        >
          {" "}
          <img src={sticker.url} alt="sticker" />{" "}
        </motion.div>
      ))}
    </>
  );
};
