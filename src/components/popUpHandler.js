import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Image } from "./blocks/image";
import { Link } from "react-router-dom";
import useWindowDimensions from "./functions/useWindowDimensions";

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
    setActivePopups((prev) => prev.filter((p) => p.id !== id));
    globalSeenPopups.add(id);
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
          console.log("pops up page popup:", popupId, popup.delay);

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
  const { width } = useWindowDimensions();
  // Calculate random x position only once (on initial render)
  const randomX = useMemo(() => {
    const min = -width / 2; // adjust these values based on your layout
    const max = width / 2;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, [width]);

  const getRandomInt = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const randomSize = useMemo(() => {
    return getRandomInt(400, 800);
  }, []);

  useEffect(() => {
    console.log("sets up popup", popup);

    const handleOutsideClick = (event) => {
      if (!document.getElementById(`popup-${popup.id}`)) {
        onDismiss(popup.id);
      }
    };

    // setXPos(xPos);

    document.addEventListener("click", handleOutsideClick);

    return () => document.removeEventListener("click", handleOutsideClick);
  }, [popup.id, onDismiss, popup]);

  return (
    <motion.div
      initial={{ y: "100%", opacity: 0 }}
      animate={{ y: "15%", opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 80,
        damping: 15,
      }}
      className="popup"
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: `translateX(calc(-50% + ${randomX}px))`,
        width: `${randomSize}px`,

        zIndex: 9999999,
      }}
    >
      {popup.url ? (
        <>
          {" "}
          <a
            onClick={() => onDismiss(popup.id)}
            href={popup.url}
            target="_blank"
            rel="noreferrer"
          >
            {popup.image && <Image image={popup.image} width={500} />}
            {popup.title && <h1>{popup.title}</h1>}
          </a>
        </>
      ) : (
        <>
          {" "}
          <Link
            onClick={() => onDismiss(popup.id)}
            key={popup.project ? "projects/" + popup.project.slug.current : "/"}
            to={popup.project ? "projects/" + popup.project.slug.current : "/"}
          >
            {popup.image && <Image image={popup.image} width={500} />}
            {popup.title && <h1>{popup.title}</h1>}
          </Link>
        </>
      )}
    </motion.div>
  );
}
