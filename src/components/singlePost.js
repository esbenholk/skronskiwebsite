import React, { useState, useEffect, useContext } from "react";
import sanityClient from "../client";
import { useParams, NavLink } from "react-router-dom";

import { HeadTags } from "./blocks/helmetHeaderTags";
import AppContext from "../globalState";
import Loader from "./blocks/loader";
import PageBuilder from "./pageBuilder";
import { pageBuilderquerystring } from "./queeries";
import Hero from "./blocks/hero";

import Frame, { Stickers } from "./frame";

export default function SinglePost() {
  const { slug } = useParams();
  const [project, setProject] = useState();

  const [nextPost, setnextPost] = useState();
  const [prevPost, setprevPost] = useState();

  const myContext = useContext(AppContext);
  const projectList = myContext.projectList;
  const info = myContext.siteSettings;

  const [combinedStickers, setCombinedStickers] = useState([]);

  const [randomPost, setRandomPost] = useState();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (myContext.projectList.length > 0) {
      setRandomPost(
        myContext.projectList[
          Math.floor(Math.random() * myContext.projectList.length)
        ]
      );
    }
  }, [slug, myContext.projectList]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "project" && slug.current == "${slug}"]{ title, location, subtitle, slug,year,date, backgroundImage{asset->{url}}, mainImage, mainSticker, maincolor, detailcolor, popup, popupsarray[]{position,delay, image, title, url, project->{slug}, useProject, textcolor, maincolor, backgroundimage}, stickerarray, stickerAmount, subtitle, textcolor, categories[]->{title, slug, color},${pageBuilderquerystring}} `
      )
      .then((data) => {
        setProject(data[0]);
        myContext.updatePageTitle(data[0].title);

        const _combinedStickers = (() => {
          const limit = data[0].stickerAmount ?? 10;

          const primary = Array.isArray(data[0].stickerarray)
            ? data[0].stickerarray
            : [];
          const fallback = Array.isArray(info?.stickerarray)
            ? info.stickerarray
            : [];

          const neededFromFallback = Math.max(0, limit - primary.length);

          return [
            ...primary.slice(0, limit),
            ...fallback.slice(0, neededFromFallback),
          ];
        })();

        setCombinedStickers(_combinedStickers);

        for (let index = 0; index < projectList.length; index++) {
          if (
            projectList[index].title === data[0].title &&
            index + 1 <= projectList.length
          ) {
            setnextPost(projectList[index + 1]);
          }
          if (projectList[index].title === data[0].title && !index - 1 <= 0) {
            setprevPost(projectList[index - 1]);
          }
        }

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
      })
      .catch(console.error);
  }, [
    slug,
    myContext.updatePageTitle,
    info.detailcolor.hex,
    projectList,
    info.maincolor.hex,
    myContext,
    info.textcolor.hex,
    info.stickerarray,
  ]);

  if (!project) return <Loader />;
  return (
    <>
      {project && (
        <>
          <HeadTags
            title={project.title}
            description={project.subtitle}
            image={project.mainImage && project.mainImage.mainImage.asset.url}
          />

          {combinedStickers.length > 0 && (
            <Stickers stickerArray={combinedStickers} />
          )}

          {project.mainImage && (
            <Hero
              image={project.mainImage.mainImage}
              givenclassname={project.mainImage.type}
            />
          )}

          <div className="pageContainer">
            <div className="realpaper projectInfo">
              <div className="projectInfoContent">
                <div>
                  <h1>{project.title}</h1>
                  <p className="year">{project.year}</p>
                </div>
                <p>{project.location}</p>
                <p>{project.subtitle}</p>
              </div>
              <Frame />
            </div>
            {project.pageBuilder && (
              <PageBuilder pageBuilder={project.pageBuilder} />
            )}
          </div>

          <div className="projectFooter">
            {prevPost && (
              <NavLink
                to={"/projects/" + prevPost.slug.current}
                className="standard-button prev"
              >
                {"<--  " + prevPost.title}
              </NavLink>
            )}

            {randomPost && (
              <NavLink
                to={"/projects/" + randomPost.slug.current}
                className="standard-button surprise"
              >
                surprise me
              </NavLink>
            )}

            {nextPost && (
              <NavLink
                to={"/projects/" + nextPost.slug.current}
                className="standard-button next"
              >
                {nextPost.title + "  -->"}
              </NavLink>
            )}
          </div>
        </>
      )}
    </>
  );
}
