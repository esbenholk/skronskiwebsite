import React from "react";
import { Link } from "react-router-dom";
import { Image } from "./blocks/image";

export default function MenuItem({ menuItem, clickHandler }) {
  return (
    <>
      {menuItem.url ? (
        <a
          // className={className}
          href={menuItem.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
        >
          {menuItem.title}
          {menuItem.image && <Image image={menuItem.image} />}
        </a>
      ) : (
        <Link
          onClick={() => {
            if (clickHandler != null) {
              clickHandler();
            }
          }} // 💥 click handler here
          key={
            menuItem.page
              ? menuItem.page.slug.current
              : menuItem.project
              ? menuItem.project.slug.current
              : "/"
          }
          to={
            menuItem.page
              ? menuItem.page.slug.current
              : menuItem.project
              ? "projects/" + menuItem.project.slug.current
              : "/"
          }
        >
          {menuItem.title}
          {menuItem.image && <Image image={menuItem.image} />}
        </Link>
      )}
    </>
  );
}
