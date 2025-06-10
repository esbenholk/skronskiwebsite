import React, { useContext, lazy, useEffect } from "react";
import AppContext from "../globalState";
import PageBuilder from "./pageBuilder";
import SVG from "react-inlinesvg";
import urlFor from "./functions/urlFor.js";
import { NavLink } from "react-router-dom";

import { Stickers } from "./frame.js";
const Projects = lazy(() => import("./projects.js"));
const MatterSimulation = lazy(() => import("./blocks/mattersimulation.js"));
// const CanvasCollage = lazy(() => import("./blocks/canvasCollage.js"));

export default function LandingPage() {
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const projectList = myContext.projectList;

  useEffect(() => {
    myContext.updatePageTitle(info.title);

    if (info.backgroundImage && info.backgroundImage.asset.url) {
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
    info.maincolor,
    info.textcolor,
    info.detailcolor,
    info.title,
    myContext,
    projectList,
  ]);

  return (
    <div>
      <div className="simulationContainer">
        {projectList && <MatterSimulation projects={projectList} />}
      </div>

      <div className="pageContainer">
        <div className="logoContainer">
          {info.logo ? (
            <SVG src={urlFor(info.logo.asset).width(300).url()} />
          ) : (
            info.title && <h1>{info.title}</h1>
          )}
          {info.subtitle && <h2>{info.subtitle}</h2>}
        </div>
        {/* {projectList && <Scene projects={projectList} />} */}
        {/* {projectList && <CanvasCollage projects={projectList} />} */}
        <div className="pageContent collageBlock">
          {projectList && <Projects projects={projectList} />}
        </div>
        <div className="pageContent collageBlock">
          {info.pageBuilder && <PageBuilder pageBuilder={info.pageBuilder} />}
        </div>
      </div>

      <div
        style={{
          width: "100%",
          minHeight: "100vh",
          position: "relative",
          marginTop: "-50%",
          pointerEvents: "none",
          zIndex: "-99",
        }}
      >
        {info.stickerarray && <Stickers stickerArray={info.stickerarray} />}
      </div>

      <div className="projectFooter">
        {myContext.randomPost && (
          <NavLink
            to={"/projects/" + myContext.randomPost.slug.current}
            className="standard-button surprise"
          >
            surprise me
          </NavLink>
        )}
      </div>
    </div>
  );
}
