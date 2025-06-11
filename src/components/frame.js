import React, { useMemo, useState, useEffect, useContext } from "react";
import SVG from "react-inlinesvg";
import urlFor from "./functions/urlFor";
import { motion } from "framer-motion";
import useWindowDimensions from "./functions/useWindowDimensions";
import AppContext from "../globalState";

const Frame = () => {
  const myContext = useContext(AppContext);
  const frameSvgs = myContext.frames;

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
        width: "105%",
        height: "105%",
        pointerEvents: "none",
        objectFit: "cover",
        zIndex: 0,
      }}
    >
      <SVG
        src={randomSvg}
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
  const myContext = useContext(AppContext);
  const detailSvgs = myContext.doodles;

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

  const getEdgePosition = (edge) => {
    const offset = getRandomInt(0, 90); // some spread along the edge
    switch (edge) {
      case "top":
        return { top: 0, left: offset };
      case "bottom":
        return { top: 95, left: offset };
      case "left":
        return { top: offset, left: 0 };
      case "right":
        return { top: offset, left: 95 };
      default:
        return { top: offset, left: offset };
    }
  };

  const chooseRandomEdge = () => {
    const edges = ["top", "bottom", "left", "right"];
    return edges[getRandomInt(0, edges.length - 1)];
  };

  useEffect(() => {
    if (!stickerArray || stickerArray.length === 0) return;

    const selected = [...stickerArray]
      .sort(() => Math.random() - 0.5)
      .slice(0, 10)
      .map((item, index) => {
        const size =
          width > 786 ? getRandomInt(100, 300) : getRandomInt(70, 150);

        const imgUrl = urlFor(item.asset).width(size).url();
        const edge = chooseRandomEdge();
        const position = getEdgePosition(edge);

        return {
          id: index,
          url: imgUrl,
          ...position,
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
