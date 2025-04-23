import React, { useContext, useState, useEffect } from "react";
import BlockContent from "./blocks/BlockContent";
import AppContext from "../globalState";
import MenuItem from "./menuItem";
import SVG from "react-inlinesvg";
import { Image } from "./blocks/image";
import { Link } from "react-router-dom";
import useWindowDimensions from "./functions/useWindowDimensions";

import sanityClient from "../client";

import imageUrlBuilder from "@sanity/image-url";
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source) {
  return builder.image(source);
}

export default function Footer() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const { width } = useWindowDimensions();

  return (
    <div className="flex-column space-between fullheight">
      <SVG
        src={
          width > 789
            ? process.env.PUBLIC_URL + "/frames/verticalline.svg"
            : process.env.PUBLIC_URL + "/frames/horizontalline.svg"
        }
        className="rightBorder"
      />

      <div className="flex-column gap">
        {info.mainImage && (
          <Link to="/">
            <Image image={info.mainImage.mainImage} width={160} />
          </Link>
        )}
        <div className="logo">
          {info.logo ? (
            <SVG src={urlFor(info.logo.asset).width(200).url()} />
          ) : (
            info.title && <h1>{info.title}</h1>
          )}
        </div>

        {info.footerContent && (
          <BlockContent blocks={info.footerContent.content} />
        )}
      </div>

      {info.footerMenu && (
        <div className="flex-column">
          {info.footerMenu.map((item, i) => {
            // const { rotate } = getRandomSkew();
            return <MenuItem menuItem={item} key={i} />;
          })}
        </div>
      )}
    </div>
  );
}
