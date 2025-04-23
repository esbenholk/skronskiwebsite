import React, { useState} from "react";
import sanityClient from "../../client";
import imageUrlBuilder from "@sanity/image-url";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import "react-lazy-load-image-component/src/effects/opacity.css";
import useWindowDimensions from "../functions/useWindowDimensions";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

export function Image(props) {
  const image = props.image;
  const assignedWidth = props.width;
  const maxHeight = props.height;
  const onLoad = props.onLoad;
  const { width } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);
  const givenclassname = props.givenclassname;
  return (
    <>
      {image && (
        <div className="centerimg">
          <LazyLoadImage
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={
              assignedWidth && assignedWidth < width
                ? urlFor(image.asset).width(assignedWidth).url()
                : assignedWidth && assignedWidth > width
                ? urlFor(image.asset)
                    .width(width - 20)
                    .url()
                : urlFor(image.asset).url()
            }
            onLoad={(e) => {
              onLoad && onLoad(true);
              setIsLoaded(true);
            }}
            placeholdersrc={urlFor(image.asset).height(2).url()}
            key={image.asset._ref}
            alt={image.alt}
            style={{
              objectPosition: image.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : "50% 50%",
              height: maxHeight,
              // maxWidth: width ? width : "100%",
            }}
            className={givenclassname}
            effect="opacity"
          />
          {!isLoaded && <div className="lazy-image-skeleton" />}
        </div>
      )}
    </>
  );
}

export function TapeImage(props) {
  const image = props.image;
  const shouldRotate = props.shouldRotate;
  const shouldScale = props.shouldScale;
  const assignedWidth = props.width;
  const maxHeight = props.height;
  const onLoad = props.onLoad;
  const givenclassname = props.givenclassname;

  const { width } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);

  const getRandomSkew = () => {
    return {
      rotate: (Math.random() - 0.5) * 10, // -3 to +3 degrees
    };
  };
  const { rotate } = getRandomSkew();

  const getRandomSize = () => {
    return {
      size: Math.random() + 0.5, // -3 to +3 degrees
    };
  };
  const { size } = getRandomSize();
  return (
    <div
      className="paper"
      style={{
        transform:
          shouldRotate && shouldScale
            ? `rotate(${rotate}deg) scale(${size})`
            : shouldRotate
            ? `rotate(${rotate}deg)`
            : shouldScale
            ? `scale(${size})`
            : null,
      }}
    >
      <div className="tape-section"></div>

      {image && (
        <>
          <LazyLoadImage
            loading="lazy"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            src={
              assignedWidth && assignedWidth < width
                ? urlFor(image.asset).width(assignedWidth).url()
                : assignedWidth && assignedWidth > width
                ? urlFor(image.asset)
                    .width(width - 20)
                    .url()
                : urlFor(image.asset).url()
            }
            onLoad={(e) => {
              onLoad && onLoad(true);
              setIsLoaded(true);
            }}
            placeholdersrc={urlFor(image.asset).height(2).url()}
            key={image.asset._ref}
            alt={image.alt}
            style={{
              objectPosition: image.hotspot
                ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
                : "50% 50%",
              height: maxHeight,
              // maxWidth: width ? width : "100%",
            }}
            effect="opacity"
            className={givenclassname}
          />
          {!isLoaded && <div className="lazy-image-skeleton" />}
        </>
      )}
      <div className="tape-section"></div>
    </div>
  );
}
