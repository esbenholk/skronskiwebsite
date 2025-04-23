import React from "react";
import { Link } from "react-router-dom";
import { Image } from "./blocks/image";
import { motion } from "framer-motion";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import SVG from "react-inlinesvg";

const stickerUrls = [
  "/frames/doodle.svg",
  "/frames/smileys.svg",
  "/frames/stars.svg",
  "/frames/simplesmiley.svg",
];

function Projects({ projects }) {
  const sortedProjects = [...projects].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  const getRandomPosition = () => ({
    top: `${Math.floor(Math.random() * 80)}%`,
    left: `${Math.floor(Math.random() * 80)}%`,
  });

  const getRandomRotation = () =>
    `rotate(${Math.floor(Math.random() * 60 - 30)}deg)`;
  const getRandomScale = () =>
    `scale(${(Math.random() * 0.5 + 0.75).toFixed(2)})`;

  const getRandomTransform = () => `${getRandomRotation()} ${getRandomScale()}`;

  const getRandomStickers = (stickers) => {
    const shuffled = [...stickers].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.floor(Math.random() * 2) + 1);
  };

  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
      <Masonry>
        {sortedProjects.map((project, index) => {
          const direction = index % 2 === 0 ? -100 : 100;
          const randomStickers = getRandomStickers(stickerUrls);
          return (
            <motion.div
              key={index}
              className="project"
              initial={{ opacity: 0, x: direction }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              // style={{
              //   maxWidth: "50%",
              //   width: "100%",
              // }}
            >
              <Link
                to={`/projects/${project.slug.current}`}
                className="project-tile"
                key={project.slug}
              >
                <Image image={project.mainImage.mainImage} />
              </Link>

              <div className="project-info">
                {project.title && (
                  <motion.div
                    className="bubble title"
                    style={{
                      position: "absolute",
                      transform: getRandomRotation(),
                      ...getRandomPosition(),
                    }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {project.title}
                  </motion.div>
                )}

                <div className="project-info-details">
                  {project.year && (
                    <motion.div
                      className="bubble year"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {project.year}
                    </motion.div>
                  )}
                  {project.location && (
                    <motion.div
                      className="bubble location"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {project.location}
                    </motion.div>
                  )}
                  {randomStickers.map((url, i) => (
                    <SVG
                      key={i}
                      src={process.env.PUBLIC_URL + url}
                      alt="sticker"
                      style={{
                        position: "absolute",
                        transform: getRandomTransform(),
                        ...getRandomPosition(),
                        width: "60px",
                        height: "auto",
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                  e
                </div>
              </div>
            </motion.div>
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}

export default Projects;
