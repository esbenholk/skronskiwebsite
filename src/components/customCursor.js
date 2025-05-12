import React, { useEffect, useRef } from "react";
import SVG from "react-inlinesvg";

const CustomCursor = ({ animateOnClasses = [] }) => {
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;

    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.top = `${e.clientY}px`;
        cursor.style.left = `${e.clientX}px`;
      }
    };

    const handleMouseEnter = () => cursor.classList.add("rotate");
    const handleMouseLeave = () => cursor.classList.remove("rotate");

    const hideCursor = () => (cursor.style.display = "none");
    const showCursor = () => (cursor.style.display = "block");

    document.addEventListener("mousemove", moveCursor);

    const selector = [
      "a",
      "button",
      ...animateOnClasses.map((cls) => `.${cls}`),
    ].join(", ");
    const targets = document.querySelectorAll(selector);
    targets.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      el.addEventListener("mouseleave", handleMouseLeave);
    });

    // ➕ Iframe handling
    const iframes = document.querySelectorAll("iframe");
    iframes.forEach((iframe) => {
      iframe.addEventListener("over", hideCursor);
      // iframe.addEventListener("mouseleave", showCursor);
    });

    return () => {
      document.removeEventListener("mousemove", moveCursor);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", handleMouseEnter);
        el.removeEventListener("mouseleave", handleMouseLeave);
      });
      iframes.forEach((iframe) => {
        iframe.removeEventListener("mouseenter", hideCursor);
        iframe.removeEventListener("mouseleave", showCursor);
      });
    };
  }, [animateOnClasses]);

  return (
    <div className="custom-cursor" ref={cursorRef}>
      {" "}
      <SVG src={process.env.PUBLIC_URL + "/frames/icons/heart10.svg"} />
    </div>
  );
};

export default CustomCursor;
