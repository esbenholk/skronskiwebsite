/* eslint-disable no-lone-blocks */
import { BrowserRouter, Routes, useLocation, Route } from "react-router-dom";
import React, { Suspense, lazy, useEffect, useState, createRef } from "react";
// import NavBar from "./components/NavBar.js";
import "./App.css";
import sanityClient from "./client";
import Header from "./components/Header";
import AppContext from "./globalState";

import { AnimatePresence, motion } from "framer-motion";

import { HeadTags } from "./components/blocks/helmetHeaderTags";
import { GlobalPopupManager } from "./components/popUpHandler.js";
import CustomCursor from "./components/customCursor.js";

const LandingPage = lazy(() => import("./components/LandingPage.js"));
const SinglePost = lazy(() => import("./components/singlePost.js"));
const SinglePage = lazy(() => import("./components/page.js"));
const Footer = lazy(() => import("./components/Footer.js"));

function App() {
  const [siteSettings, setSiteSettings] = useState();
  const [projectList, setProjectList] = useState();

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const mainRef = createRef();
  const [categoryNames, setCategoryNames] = useState([]);
  const [pageTitle, setPageTitle] = useState();
  const [stickerArray, setStickerArray] = useState([]);

  const updatePageTitle = (newTitle) => {
    setPageTitle(newTitle);
  };
  // get sitesettings and page names (for slug redirection)
  useEffect(() => {
    console.log("u r doing amazing sweety");

    sanityClient
      .fetch(
        '*[_type == "siteSettings" ]{backgroundImage{asset->{url}}, favicon{asset->{url}}, mainImage, logo, maincolor, detailcolor, collagelayers, popup, popupsarray[]{delay, image, title, url, project->{slug}, useProject, textcolor, maincolor, backgroundimage}, stickerarray, subtitle, textcolor, title, headerMenu[] {_type == "menuItem" => { _type, image, page->{slug}, project->{slug}, url, title}}, footerMenu[] {_type == "menuItem" => { _type, image, page->{slug}, project->{slug}, url, title}}, footerContent}'
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

        setSiteSettings(data[0]);
      })
      .catch(console.error);
  }, []);

  ///get project data, set category names
  useEffect(() => {
    console.log("xoxo ur webdev artist esben holk");

    sanityClient
      .fetch(
        ' *[_type == "project"]{ title, slug, date, location, description, year, mainImage, stickerarray, tags, categories[]->{title, slug, color}, }'
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
        setCategoryNames(tempCategoryNames);
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

                {siteSettings.popupsarray &&
                  siteSettings.popupsarray.length > 0 && (
                    <GlobalPopupManager popups={siteSettings.popupsarray} />
                  )}

                <CustomCursor
                  animateOnClasses={[
                    "standard-button",
                    "thumbnail",
                    "menu-image-peek",
                  ]}
                />

                {/* Main content + transitions */}
                <main className="main-content">
                  <SlidingRoutes />
                </main>

                {/* Static Footer — now left-fixed on desktop */}
                <div className="footer cardboard-style ">
                  <Footer />
                </div>
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
  // {
  //   path: "/projects",
  //   element: (
  //     <>
  //       <div className="background"></div>
  //       <Projects />
  //     </>
  //   ),
  // },
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
