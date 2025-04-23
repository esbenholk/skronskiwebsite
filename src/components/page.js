import React, { useContext, useEffect, useState } from "react";
import AppContext from "../globalState";
import sanityClient from "../client";
import { useParams, useSearchParams } from "react-router-dom";
import { HeadTags } from "./blocks/helmetHeaderTags";

import { PageSpecificPopupManager } from "./popUpHandler";
// import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";
import Hero from "./blocks/hero";
import { Stickers } from "./frame";
export default function SinglePage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const [singlePage, setSinglePage] = useState();
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);
  ///get project data, set category names
  useEffect(() => {
    const params = [];

    searchParams.forEach((value, key) => {
      params.push([key, value]);
    });

    sanityClient
      .fetch(
        `*[_type == "page" && slug.current == "${slug}"]{ title, slug,  mainImage, maincolor, popup,popupsarray[]{delay, image, title, url, project->{slug}, useProject, textcolor, maincolor, backgroundimage}, stickerarray, backgroundImage{asset->{url}}, textcolor,  categories[]->{title, slug},${pageBuilderquerystring}} `
      )
      .then((data) => {
        setSinglePage(data[0]);

        console.log("page", data[0]);

        if (data[0].backgroundImage && data[0].backgroundImage.asset.url) {
          document.documentElement.style.setProperty(
            "--backgroundImage",
            "url(" + data[0].backgroundImage.asset.url + ")"
          );
        } else {
          document.documentElement.style.removeProperty("--backgroundImage");
        }
        if (data[0].maincolor) {
          document.documentElement.style.setProperty(
            "--main-color",
            data[0].maincolor.hex
          );
        } else {
          document.documentElement.style.setProperty(
            "--main-color",
            info.maincolor.hex
          );
        }
        if (data[0].textcolor) {
          document.documentElement.style.setProperty(
            "--text-color",
            data[0].textcolor.hex
          );
        } else {
          document.documentElement.style.setProperty(
            "--text-color",
            info.textcolor.hex
          );
        }

        if (data[0].detailcolor) {
          document.documentElement.style.setProperty(
            "--detail-color",
            data[0].detailcolor.hex
          );
        } else {
          document.documentElement.style.setProperty(
            "--detail-color",
            info.detailcolor.hex
          );
        }

        if (params.length === 0) {
          myContext.updatePageTitle(data[0].title);
        }
      })
      .catch(console.error);
  }, [
    slug,
    searchParams,
    info.detailcolor.hex,
    info.maincolor.hex,
    info.textcolor.hex,
    myContext,
  ]);

  // if (!singlePage) return <Loader />;

  return (
    <>
      {singlePage && (
        <>
          <HeadTags
            title={singlePage.title}
            description={singlePage.subtitle}
            image={
              singlePage.mainImage && singlePage.mainImage.mainImage.asset.url
            }
          />

          {singlePage.popupsarray && singlePage.popupsarray.length > 0 && (
            <PageSpecificPopupManager popups={singlePage.popupsarray} />
          )}

          {singlePage.stickerarray && (
            <Stickers stickerArray={singlePage.stickerarray} />
          )}
          {info.stickerarray && <Stickers stickerArray={info.stickerarray} />}

          {singlePage.mainImage && (
            <Hero
              // ref={scollToRef}
              image={singlePage.mainImage.mainImage}
              givenclassname={singlePage.mainImage.type}
            />
          )}
          {singlePage.pageBuilder && (
            <div className="pageContainer">
              {singlePage.pageBuilder && (
                <PageBuilder pageBuilder={singlePage.pageBuilder} />
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
