import React, { useContext, useState, useRef, useEffect } from "react";
import AppContext from "../globalState";
import SVG from "react-inlinesvg";
import MenuItem from "./menuItem.js";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Header({ pageName }) {
  const myContext = useContext(AppContext);

  return (
    <>
      {/* <div className="title standard-button">
         
        <p>{pageName}</p>
         
      </div> */}
      {myContext && myContext.siteSettings.headerMenu && (
        <SketchyMenu items={myContext.siteSettings.headerMenu} />
      )}
    </>
  );
}

const SketchyMenu = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation(); // 👈 Hook to get current path

  const openCloseMenu = (bool) => {
    setIsOpen(bool);
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const getRandomSkew = () => {
    return {
      rotate: (Math.random() - 0.5) * 10, // -3 to +3 degrees
    };
  };

  return (
    <div className="menu-wrapper">
      <AnimatePresence>
        <motion.div
          onClick={() => openCloseMenu(!isOpen)}
          alt="menu teaser"
          className={isOpen ? "menu-image-peek open" : "menu-image-peek"}
          initial={false}
          animate={{
            transition: { type: "spring", stiffness: 70, damping: 12 },
          }}
        >
          <img
            src={process.env.PUBLIC_URL + "/skronskis/banana.png"}
            alt="hand holding a banan peel as menu icon"
          />
          <SVG
            src={"/frames/icons/menu.svg"}
            style={{
              width: "20%",
              position: "absolute",
              top: "50%",
              left: "30px",
              display: "block",
            }}
            preProcessor={(code) =>
              code.replace(/<svg/, '<svg preserveAspectRatio="none"')
            }
          />
        </motion.div>
        {isOpen && (
          <motion.div
            ref={menuRef}
            key={"menu-container"}
            className="menu-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {items.map((item, i) => {
              const { rotate } = getRandomSkew();
              return (
                <motion.div
                  key={i}
                  initial={{
                    x: "100vw",
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    rotate,

                    transition: {
                      delay: i * 0.1,
                      type: "spring",
                      stiffness: 80,
                      damping: 12,
                    },
                  }}
                  exit={{
                    x: "100vw",
                    opacity: 1,
                    transition: {
                      delay: (items.length - i) * 0.05,
                    },
                  }}
                  className="standard-button"
                >
                  <MenuItem menuItem={item} clickHandler={openCloseMenu} />
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
