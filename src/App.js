/* eslint-disable no-lone-blocks */
import { BrowserRouter, Routes, useLocation, Route } from "react-router-dom";
import { Suspense, lazy, useEffect, useState, createRef } from "react";
// import NavBar from "./components/NavBar.js";
import "./App.css";
import sanityClient from "./client";
import Header from "./components/Header";
import AppContext from "./globalState";

import { AnimatePresence, motion } from "framer-motion";

import useWindowDimensions from "./components/functions/useWindowDimensions.js";

import { HeadTags } from "./components/blocks/helmetHeaderTags";
import { PageSpecificPopupManager } from "./components/popUpHandler.js";
import CustomCursor from "./components/customCursor.js";
import imageUrlBuilder from "@sanity/image-url";
import { pageBuilderquerystring } from "./components/queeries.js";
// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);
export function urlFor(source) {
  return builder.image(source);
}
const LandingPage = lazy(() => import("./components/LandingPage.js"));
const SinglePost = lazy(() => import("./components/singlePost.js"));
const SinglePage = lazy(() => import("./components/page.js"));
const Footer = lazy(() => import("./components/Footer.js"));
const ProjectPage = lazy(() => import("./components/projectPage.js"));
const Category = lazy(() => import("./components/Category.js"));

function App() {
  const [siteSettings, setSiteSettings] = useState();
  const [projectList, setProjectList] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const mainRef = createRef();

  const [pageTitle, setPageTitle] = useState();
  const [frames, setFrames] = useState([]);
  const [doodles, setDoodles] = useState([]);
  const [playButtons, setPlayButtons] = useState([]);
  const { width } = useWindowDimensions();
  const updatePageTitle = (newTitle) => {
    setPageTitle(newTitle);
  };

  // get sitesettings and page names (for slug redirection)
  useEffect(() => {
    sanityClient
      .fetch(
        '*[_type == "siteSettings" ]{backgroundImage{asset->{url}}, favicon{asset->{url}}, mainImage, frames, doodles, playButtons, logo, maincolor, detailcolor, collagelayers,collagelayersMobile, popup, popupsarray[]{position,delay, image, title, url, project->{slug}, useProject, textcolor, maincolor, backgroundimage}, stickerarray, subtitle, textcolor, title, headerMenu[] {_type == "button" => { _type, linkTarget{url, project->{slug},category->{slug},page->{slug}, type}, title}}, footerMenu[] {_type == "button" => { _type, linkTarget{url, project->{slug},category->{slug},page->{slug}, type}, title}}, footerContent}'
      )
      .then((data) => {
        console.log("site settings", data[0]);

        setPageTitle(data[0].title);

        if (data[0].backgroundImage && data[0].backgroundImage.asset.url) {
          document.documentElement.style.setProperty(
            "--backgroundImage",
            "url(" + data[0].backgroundImage.asset.url + ")"
          );
        }
        if (data[0].maincolor) {
          document.documentElement.style.setProperty(
            "--main-color",
            data[0].maincolor.hex
          );
        }
        if (data[0].textcolor) {
          document.documentElement.style.setProperty(
            "--text-color",
            data[0].textcolor.hex
          );
        }
        if (data[0].detailcolor) {
          document.documentElement.style.setProperty(
            "--detail-color",
            data[0].detailcolor.hex
          );
        }

        if (data[0].frames) {
          let assets = [];
          for (let index = 0; index < data[0].frames.length; index++) {
            assets.push(urlFor(data[0].frames[index].asset).url());
          }
          setFrames(assets);
        }
        if (data[0].doodles) {
          let dassets = [];
          for (let index = 0; index < data[0].doodles.length; index++) {
            dassets.push(urlFor(data[0].doodles[index].asset).url());
          }
          setDoodles(dassets);
        }
        if (data[0].playButtons) {
          let passets = [];
          for (let index = 0; index < data[0].playButtons.length; index++) {
            passets.push(urlFor(data[0].playButtons[index].asset).url());
          }
          setPlayButtons(passets);
        }

        setSiteSettings(data[0]);
      })
      .catch(console.error);
  }, []);

  ///get project data, set category names
  useEffect(() => {
    console.log("xoxo ur webdev artist esben holk");

    sanityClient
      .fetch(
        ` *[_type == "project"]{ title, slug, date, location, description, year, mainImage, mainSticker,stickerarray, tags, categories[]->{title, slug, color}, ${pageBuilderquerystring} }`
      )
      .then((data) => {
        data.sort((a, b) => b.year - a.year);
        setProjectList(data);

        var categories = [];
        var tempCategoryNames = [];
        for (let index = 0; index < data.length; index++) {
          const post = data[index];
          if (post.categories != null && Array.isArray(post.categories)) {
            for (let index = 0; index < post.categories.length; index++) {
              const category = post.categories[index];

              if (!tempCategoryNames.includes(category.title)) {
                tempCategoryNames.push(category.title);
                categories.push(category);
              }
            }
          }
        }
        setCategories(categories);
      })
      .catch(console.error);
  }, []);

  ///set global context available
  const globalContext = {
    siteSettings: siteSettings,
    projectList: projectList,
    tags: tags,
    categories: categories,
    mainRef: mainRef,
    frames: frames,
    doodles: doodles,
    playButtons: playButtons,

    setSiteSettings,
    setProjectList,
    setTags,
    setCategories,
    updatePageTitle: updatePageTitle,
  };

  return (
    <div className={"app-container"}>
      {siteSettings && (
        <>
          <HeadTags
            title={siteSettings.title}
            description={siteSettings.greeting}
            faviconUrl={
              siteSettings.favicon ? siteSettings.favicon.asset.url : ""
            }
          />
          <Suspense fallback={<div className="loader"></div>}>
            <AppContext.Provider value={globalContext} ref={mainRef}>
              <BrowserRouter>
                {siteSettings && (
                  <Header
                    pageName={pageTitle}
                    menuItems={siteSettings.headerMenu}
                  />
                )}

                {width > 786 && (
                  <CustomCursor
                    animateOnClasses={[
                      "standard-button",
                      "thumbnail",
                      "menu-image-peek",
                    ]}
                  />
                )}

                {/* Main content + transitions */}
                <main className="main-content">
                  <SlidingRoutes />
                </main>

                {/* Static Footer — now left-fixed on desktop */}
                <div className="footer cardboard-style ">
                  <Footer />
                </div>

                {siteSettings.popupsarray &&
                  siteSettings.popupsarray.length > 0 && (
                    <PageSpecificPopupManager
                      popups={siteSettings.popupsarray}
                    />
                  )}
              </BrowserRouter>
            </AppContext.Provider>
          </Suspense>
        </>
      )}
    </div>
  );
}

export default App;

const routes = [
  {
    path: "/",

    element: (
      <>
        <div className="background"></div>
        <LandingPage />
      </>
    ),
  },
  {
    path: "/projects/:slug",
    element: (
      <>
        <div className="background"></div>
        <SinglePost />
      </>
    ),
  },
  {
    path: "/projects",
    element: (
      <>
        <div className="background"></div>
        <ProjectPage />
      </>
    ),
  },
  {
    path: "category/:slug",
    element: (
      <>
        <div className="background"></div>
        <Category />
      </>
    ),
  },
  {
    path: "/:slug",
    element: (
      <>
        <div className="background"></div>
        <SinglePage />{" "}
      </>
    ),
  },
];

const SlidingRoutes = () => {
  const location = useLocation();

  return (
    <div
      style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}
    >
      <AnimatePresence
        mode="wait"
        initial={false}
        onExitComplete={() => {
          window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }}
      >
        <motion.div
          key={location.pathname}
          initial={{ x: "100%", opacity: 1 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "-100%", opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 20,
            mass: 0.5,
          }}
          style={{
            position: "relative",
            width: "100%",
            top: 0,
            left: 0,
          }}
        >
          {/* Inner wrapper for natural layout/scrolling */}
          <div style={{ position: "relative", minHeight: "100vh" }}>
            <Routes location={location}>
              {routes.map(({ path, element }) => (
                <Route key={path} path={path} element={element} />
              ))}
            </Routes>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
