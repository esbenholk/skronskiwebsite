import React, { useEffect, useContext } from "react";

import Projects from "./projects";

import { HeadTags } from "./blocks/helmetHeaderTags";
import AppContext from "../globalState";
import Loader from "./blocks/loader";

import { Stickers } from "./frame";

export default function ProjectPage() {
  const myContext = useContext(AppContext);
  const projectList = myContext.projectList;
  const info = myContext.siteSettings;

  useEffect(() => {
    console.log("projects", myContext);

    if (info.backgroundImage) {
      document.documentElement.style.setProperty(
        "--backgroundImage",
        "url(" + info.backgroundImage.asset.url + ")"
      );
    } else {
      document.documentElement.style.removeProperty("--backgroundImage");
    }
    if (info.maincolor) {
      document.documentElement.style.setProperty(
        "--main-color",
        info.maincolor.hex
      );
    }

    if (info.textcolor) {
      document.documentElement.style.setProperty(
        "--text-color",
        info.textcolor.hex
      );
    }

    if (info.detailcolor) {
      document.documentElement.style.setProperty(
        "--detail-color",
        info.detailcolor.hex
      );
    }
  }, [
    info.backgroundImage,
    info.detailcolor,
    info.maincolor,
    info.textcolor,
    myContext,
  ]);
  if (!projectList) return <Loader />;
  return (
    <>
      {projectList && (
        <>
          <HeadTags
            title={"Alberte's Projects"}
            description={info.subtitle}
            image={info.mainImage && info.mainImage.mainImage.asset.url}
          />

          {info.stickerarray && <Stickers stickerArray={info.stickerarray} />}

          <div className="pageContainer">
            <Projects projects={projectList} />
          </div>
        </>
      )}
    </>
  );
}
