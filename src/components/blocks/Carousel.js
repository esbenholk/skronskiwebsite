import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { TapeImage } from "./image";
import { Detail } from "../frame";
import Frame from "../frame";

export default function CustomCarousel({ images }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
      <Masonry>
        {images.map((image, index) => {
          const showFrame = Math.random() < 0.4; // 40% chance
          return (
            <div key={index}>
              <TapeImage image={image} />
              {showFrame && <Frame />}
              <Detail />
            </div>
          );
        })}
      </Masonry>
    </ResponsiveMasonry>
  );
}
