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
    "/frames/heart1.svg",
    "/frames/heart2svg",
    "/frames/heart3.svg",
    "/frames/heart4.svg",
    "/frames/hearts.svg",
    "/frames/doodle.svg",
    "/frames/smiley1.svg",
    "/frames/smiley2.svg",
    "/frames/smiley3.svg",
    "/frames/smileys.svg",
    "/frames/star1.svg",
    "/frames/star2.svg",
    "/frames/star3.svg",
    "/frames/stars.svg",
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
    return width > 786 ? 50 + Math.random() * 150 : 10 + Math.random() * 10;
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
        src={randomDetail}
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
          width > 786 ? getRandomInt(100, 300) : getRandomInt(50, 100); // px
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
