import React from "react";
import { TapeImage, Image } from "./image";
import useWindowDimensions from "../functions/useWindowDimensions";

function Hero({ image, givenclassname }) {
  let { height, width } = useWindowDimensions();

  return (
    <div className="hero">
      {givenclassname == "stretch" ? (
        <TapeImage
          image={image}
          height={width > 789 ? height - 60 : height - 30}
          givenclassname={givenclassname}
        />
      ) : (
        <Image
          image={image}
          height={width > 789 ? height - 60 : height - 30}
          givenclassname={givenclassname}
        />
      )}
    </div>
  );
}

export default Hero;
