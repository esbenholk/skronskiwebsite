import React, { useRef, useEffect, useState, useContext } from "react";
import AppContext from "../../globalState";

import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import useWindowDimensions from "../functions/useWindowDimensions";
// Get a pre-configured url-builder from your sanity client
import sanityClient from "../../client";

import imageUrlBuilder from "@sanity/image-url";
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

// const imageUrl = urlFor(project.mainImage.asset).width(200).url();

export default function CanvasCollage({ projects }) {
  const [layers, setLayers] = useState({ fg: [], mg: [], bg: [] });
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const { width } = useWindowDimensions();

  const { scrollY } = useScroll();

  // 👇 horizontal transforms instead of vertical
  const xFG = useTransform(scrollY, [0, 1000], [0, 500]); // fg moves right
  const xMG = useTransform(scrollY, [0, 1000], [0, -500]); // mg moves left

  useEffect(() => {
    const allStickers = projects.flatMap((p) =>
      p.stickerarray.map((img) => ({
        imageUrl: urlFor(img.asset).width(300).url(),
        projectUrl: `/projects/${p.slug.current}`,
      }))
    );

    const shuffled = allStickers.sort(() => 0.5 - Math.random());
    const third = Math.ceil(shuffled.length / 3);

    setLayers({
      fg: shuffled.slice(0, third),
      mg: shuffled.slice(third, third * 2),
      bg: shuffled.slice(third * 2),
    });
  }, [projects]);

  const renderStickers = (stickers, layer) => {
    const placed = [];
    const threshold = 100; // min px distance between stickers

    const getRandomNumber = () => {
      let min, max;
      switch (layer) {
        case "fg":
          min = width > 789 ? 200 : 200;
          max = width > 789 ? 400 : 300;
          break;
        case "mg":
          min = width > 789 ? 150 : 150;
          max = width > 789 ? 300 : 200;
          break;
        case "bg":
          min = width > 789 ? 50 : 30;
          max = width > 789 ? 120 : 50;
          break;
        default:
          min = 100;
          max = 200;
      }
      return Math.random() * (max - min) + min;
    };

    const getRandomPosition = () => {
      let tries = 0;

      // 🎯 Define vertical constraints by layer
      let minTop, maxTop;
      switch (layer) {
        case "fg":
          minTop = width > 789 ? 40 : 60;
          maxTop = width > 789 ? 70 : 80;
          break;
        case "mg":
          minTop = width > 789 ? 30 : 40;
          maxTop = width > 789 ? 60 : 70;
          break;
        case "bg":
          minTop = width > 789 ? 0 : 0;
          maxTop = width > 789 ? 80 : 70;
          break;
        default:
          minTop = 20;
          maxTop = 80;
      }

      while (tries < 100) {
        const left = Math.random() * (90 - -20) - 20;
        const top = Math.random() * (maxTop - minTop) + minTop; // e.g., 80%–95%

        const isTooClose = placed.some((pos) => {
          const dx = ((pos.left - left) * window.innerWidth) / 100;
          const dy = ((pos.top - top) * window.innerHeight) / 100;
          return Math.sqrt(dx * dx + dy * dy) < threshold;
        });

        if (!isTooClose) {
          placed.push({ left, top });
          return { left, top };
        }
        tries++;
      }

      // fallback
      const fallbackTop = Math.random() * (maxTop - minTop) + minTop;
      const fallbackLeft = Math.random() * (90 - -20) - 20;
      placed.push({ left: fallbackLeft, top: fallbackTop });
      return { left: fallbackLeft, top: fallbackTop };
    };

    return stickers.map((img, i) => {
      const { left, top } = getRandomPosition();
      const width = getRandomNumber();

      return (
        <Link to={img.projectUrl}>
          <img
            key={`${layer}-${i}`}
            src={img.imageUrl}
            alt="sticker"
            className={`sticker ${layer}-sticker`}
            style={{
              top: `${top}%`,
              left: `${left}%`,
              zIndex: Math.round(top),
              width: width,
            }}
          />
        </Link>
      );
    });
  };

  return (
    <div className="sticker-collage">
      {/* Background (static, vertical only) */}
      <div className="background-layer">
        {renderStickers(layers.bg, "bg")}

        <img
          src={urlFor(info.collagelayers.images[2]).width(width).url()}
          className="background-img"
          alt="background"
        />
      </div>

      {/* Middleground - moves left on scroll */}
      <motion.div className="middleground-layer" style={{ x: xMG }}>
        {renderStickers(layers.mg, "mg")}

        <img
          src={urlFor(info.collagelayers.images[1])
            .width(width + 500)
            .url()}
          className="hill-img hill-img-middle"
          alt="middleground"
        />
      </motion.div>

      {/* Foreground - moves right on scroll */}
      <motion.div className="foreground-layer" style={{ x: xFG }}>
        {renderStickers(layers.fg, "fg")}
        <img
          src={urlFor(info.collagelayers.images[0])
            .width(width + 500)
            .url()}
          className="hill-img"
          alt="foreground"
        />
      </motion.div>
    </div>
  );
}
