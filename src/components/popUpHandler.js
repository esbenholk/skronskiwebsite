import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "./blocks/image";
import { Link } from "react-router-dom";
import useWindowDimensions from "./functions/useWindowDimensions";
import { AnimatePresence } from "framer-motion";
import urlFor from "./functions/urlFor";

// Utility to generate unique ID for each popup
const getPopupId = (popup, index) => `${popup.title}_${index}`;

// Global seen popups tracking
const globalSeenPopups = new Set();

export function GlobalPopupManager({ popups }) {
  const [activePopups, setActivePopups] = useState([]);

  useEffect(() => {
    const timers = popups.map((popup, index) => {
      const popupId = getPopupId(popup, index);
      if (!globalSeenPopups.has(popupId)) {
        return setTimeout(() => {
          setActivePopups((prev) => [...prev, { ...popup, id: popupId }]);
        }, popup.delay * 1000);
      }
      return null;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [popups]);

  const handleDismiss = (id) => {
    console.log("dismisses pop up", id);

    // setActivePopups((prev) => prev.filter((p) => p.id !== id));
    globalSeenPopups.add(id);

    console.log("adds to seen", activePopups, globalSeenPopups);
  };

  return (
    <div>
      {activePopups.map((popup) => (
        <Popup key={popup.id} popup={popup} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}

export function PageSpecificPopupManager({ popups }) {
  const location = useLocation();
  const [activePopups, setActivePopups] = useState([]);

  useEffect(() => {
    const timers = popups.map((popup, index) => {
      const popupId = getPopupId(popup, index);
      const stored = sessionStorage.getItem(popupId);

      if (!stored) {
        return setTimeout(() => {
          setActivePopups((prev) => [...prev, { ...popup, id: popupId }]);
          sessionStorage.setItem(popupId, "shown");
        }, popup.delay * 1000);
      }
      return null;
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [location.pathname, popups]);

  const handleDismiss = (id) => {
    setActivePopups((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div>
      {activePopups.map((popup) => (
        <Popup key={popup.id} popup={popup} onDismiss={handleDismiss} />
      ))}
    </div>
  );
}

function Popup({ popup, onDismiss }) {
  const [isOpen, setIsOpen] = useState(false);
  const [randomOffset, setRandomOffset] = useState(0);
  const [position] = useState(popup.position ? popup.position : "bottom"); // default, will randomize later
  const { width } = useWindowDimensions();

  useEffect(() => {
    // Random offset for X or Y (depends on position)
    const random = Math.floor(Math.random() * 70);
    setRandomOffset(random);

    // Open popup after delay
    setTimeout(() => {
      setIsOpen(true);
    }, 1000);

    // Dismiss logic
    const handleOutsideClick = (event) => {
      if (document.getElementById(`popup-${popup.id}`)) {
        setIsOpen(false);
        onDismiss(popup.id);
      }
      console.log("closing popup", { isOpen });
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [popup.id, onDismiss, popup, isOpen]);

  const isVertical = position === "top" || position === "bottom";
  const isTopOrLeft = position === "top" || position === "left";

  // Positioning styles
  const positioningStyles = {
    top: position === "top" ? 0 : "auto",
    bottom: position === "bottom" ? 0 : "auto",
    left: position === "left" ? 0 : isVertical ? `${randomOffset}%` : "auto",
    right: position === "right" ? 0 : !isVertical ? `${randomOffset}%` : "auto",
    color: popup.textcolor && popup.textcolor.hex,
    backgroundColor: popup.maincolor && popup.maincolor.hex,
    backgroundImage:
      popup.backgroundimage &&
      "url(" + urlFor(popup.backgroundimage.asset).width(200).url() + ")",
  };

  // Animation direction
  const initial = isVertical
    ? { y: isTopOrLeft ? "-100%" : "100%" }
    : { x: isTopOrLeft ? "-100%" : "100%" };

  const animate = isVertical
    ? { y: isTopOrLeft ? "-10%" : "10%" }
    : { x: isTopOrLeft ? "-10%" : "10%" };

  const exit = isVertical
    ? { y: isTopOrLeft ? "-100%" : "100%" }
    : { x: isTopOrLeft ? "-100%" : "100%" };

  return (
    <div className="popup-container">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={popup.id}
            id={`popup-${popup.id}`}
            className="popup-box"
            style={positioningStyles}
            initial={initial}
            animate={animate}
            exit={exit}
            transition={{ type: "ease", stiffness: 300, damping: 30 }}
          >
            {popup.url ? (
              <a
                onClick={() => onDismiss(popup.id)}
                href={popup.url}
                target="_blank"
                rel="noreferrer"
              >
                {popup.image && (
                  <Image
                    image={popup.image}
                    width={width > 500 ? 500 : width - 100}
                  />
                )}
                {popup.title && <h1>{popup.title}</h1>}
              </a>
            ) : (
              <Link
                onClick={() => onDismiss(popup.id)}
                to={
                  popup.project
                    ? "/projects/" + popup.project.slug.current
                    : "/"
                }
              >
                {popup.image && (
                  <Image
                    image={popup.image}
                    width={width > 500 ? 500 : width - 100}
                  />
                )}
                {popup.title && <h1>{popup.title}</h1>}
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
