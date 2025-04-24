import React, { useEffect } from "react";
import BlockContent from "./blocks/BlockContent";
import Video from "./blocks/videoPlayer";
import { useInView } from "react-intersection-observer";

import { TapeImage } from "./blocks/image";
import { Link } from "react-router-dom";

import CustomCarousel from "./blocks/Carousel";
import { motion, useAnimation } from "framer-motion";
import Frame, { Detail } from "./frame";

function PageBlock({ pageBlock }) {
  return (
    <>
      {pageBlock._type === "gallery" && (
        <>
          {pageBlock.images ? (
            <>
              <CustomCarousel images={pageBlock.images}></CustomCarousel>
              <Detail />
            </>
          ) : null}
        </>
      )}

      {pageBlock._type === "image" && (
        <>
          {pageBlock.asset && (
            <>
              <TapeImage image={pageBlock} />
              <Frame />
            </>
          )}
        </>
      )}

      {pageBlock._type === "listobject" && (
        <div className="cvblock textblock">
          <h3>{pageBlock.title}</h3>
          {pageBlock.listicles.map((listicle, i) => {
            return (
              <div key={i} className="listItem">
                <p>{listicle.year}</p>
                {listicle.linkTarget && listicle.linkTarget.project ? (
                  <Link
                    key={
                      listicle.linkTarget.project
                        ? listicle.linkTarget.project.slug.current
                        : "/"
                    }
                    to={
                      listicle.linkTarget.project
                        ? "/projects/" +
                          listicle.linkTarget.project.slug.current
                        : "/"
                    }
                  >
                    {listicle.title}
                  </Link>
                ) : listicle.linkTarget && listicle.linkTarget.url ? (
                  <Link
                    target="_blank"
                    rel="noopener noreferrer"
                    key={listicle.linkTarget.url}
                    to={listicle.linkTarget.url}
                  >
                    {listicle.title}
                  </Link>
                ) : (
                  <p>{listicle.title}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {pageBlock._type === "breadContent" && (
        <>
          {pageBlock.content && (
            <div className="realpaper textblock">
              <BlockContent blocks={pageBlock.content} />
              <Detail />
            </div>
          )}
        </>
      )}

      {pageBlock._type === "video" && (
        <>
          <h1>{pageBlock.title}</h1>
          <div className="block">
            <Video url={pageBlock.url} thumbnail={pageBlock.cover} />
          </div>
          {pageBlock.description && (
            <motion.div className="video-info">
              <BlockContent blocks={pageBlock.description} />
            </motion.div>
          )}
        </>
      )}
    </>
  );
}

export default function PageBuilder({ pageBuilder }) {
  return (
    <div className="pageBuilderContent">
      {pageBuilder.map((pageBlock, i) => {
        const isLeft = i % 2 === 0;
        return (
          <AnimatedPageBlock
            key={i}
            pageBlock={pageBlock}
            rotate={0}
            isLeft={isLeft}
          />
        );
      })}
    </div>
  );
}

function AnimatedPageBlock({ pageBlock, rotate, isLeft }) {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    if (inView) {
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: 0.2, ease: "easeOut" },
      });
    }
  }, [controls, inView, rotate]);

  return (
    <motion.div
      ref={ref}
      className="pageBlockItem"
      // initial={{ x: isLeft ? -100 : 100, opacity: 0, rotate: 0 }}
      animate={controls}
    >
      <PageBlock pageBlock={pageBlock} />
    </motion.div>
  );
}
