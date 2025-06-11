import { useEffect, useState, useContext } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";
import Projects from "./projects";
import { pageBuilderquerystring } from "./queeries";
import { HeadTags } from "./blocks/helmetHeaderTags";
import { Link } from "react-router-dom";
import AppContext from "../globalState";
import { PageSpecificPopupManager } from "./popUpHandler";

import PageBuilder from "./pageBuilder";
import { Stickers } from "./frame";

export default function Category() {
  const { slug } = useParams();
  const [singlePage, setSinglePage] = useState();
  const myContext = useContext(AppContext);
  const info = myContext.siteSettings;
  const projectList = myContext.projectList;
  const allCatagories = myContext.categories;
  const [sortedProjectList, setSortedProjectList] = useState([]);

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "category" && slug.current == "${slug}"]{ title, location, subtitle, slug,year,date, backgroundImage{asset->{url}}, mainImage, maincolor, detailcolor, popup, popupsarray[]{position,delay, image, title, url, project->{slug}, useProject, textcolor, maincolor, backgroundimage}, stickerarray, subtitle, textcolor, categories[]->{title, slug, color},${pageBuilderquerystring}} `
      )
      .then((data) => {
        setSinglePage(data[0]);

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

        // if (params.length === 0) {
        //   myContext.updatePageTitle(data[0].title);
        // }
        let _sortedprojects = [];
        for (var i = 0; i < projectList.length; i++) {
          var project = projectList[i];
          if (
            project.categories.find(
              (category) => category.title.toLowerCase() === slug
            )
          ) {
            _sortedprojects.push(project);
            console.log("has project", project);
          }
        }
        console.log(_sortedprojects);

        setSortedProjectList(_sortedprojects);
      })
      .catch(console.error);
  }, [
    slug,
    info.detailcolor.hex,
    info.maincolor.hex,
    info.textcolor.hex,
    projectList,
  ]);

  return (
    // <div className="content-container ">
    //   <div className="fullWidthPadded category_details">
    //     {category && (
    //       <>
    //         {" "}
    //         <h1 className="noMargin categoryTitle">{category.title}</h1>
    //         <>
    //           {category.description && (
    //             <div className="subheadline">
    //               <BlockContent blocks={category.description} />
    //             </div>
    //           )}
    //         </>
    //       </>
    //     )}
    //   </div>

    //   <Suspense fallback={null}>
    //     {sortedProjectList && sortedProjectList.length > 0 ? (
    //       <Projects projectList={sortedProjectList} />
    //     ) : null}
    //   </Suspense>
    // </div>
    <>
      {singlePage && (
        <>
          <div className="pageContainer catContainer">
            <h1>{singlePage.title}</h1>
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

            {singlePage.stickerarray ? (
              <Stickers stickerArray={singlePage.stickerarray} />
            ) : (
              info.stickerarray && <Stickers stickerArray={info.stickerarray} />
            )}

            {sortedProjectList && sortedProjectList.length > 0 ? (
              <>
                <Projects projects={sortedProjectList} />
              </>
            ) : null}

            {singlePage.pageBuilder && (
              <>
                {singlePage.pageBuilder && (
                  <PageBuilder pageBuilder={singlePage.pageBuilder} />
                )}
              </>
            )}
          </div>

          {allCatagories && allCatagories.length > 0 ? (
            <div className="pageContainer buttons flex-row gap">
              {allCatagories.map((cat, i) => {
                return (
                  <div key={i} className="standard-button">
                    <Link
                      key={i.toString() + cat.title}
                      to={"/category/" + cat.slug.current}
                    >
                      {cat.title}
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
