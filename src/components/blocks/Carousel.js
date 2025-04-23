import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { TapeImage } from "./image";
import { Detail } from "../frame";

export default function CustomCarousel({ images }) {
  return (
    <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 2 }}>
      <Masonry>
        {images.map((image, index) => (
          <div key={index}>
            <TapeImage
              image={image}

              // shouldRotate={true}
              // shouldScale={true}
            />
            <Detail />
          </div>
        ))}
      </Masonry>
    </ResponsiveMasonry>
  );
}
