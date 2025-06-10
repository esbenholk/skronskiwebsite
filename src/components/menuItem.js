import { Link } from "react-router-dom";

export default function MenuItem({ menuItem, clickHandler }) {
  return (
    <>
      <Link
        key={menuItem.title}
        to={
          menuItem.linkTarget.page
            ? "/" + menuItem.linkTarget.page.slug.current
            : menuItem.linkTarget.project
            ? "/projects/" + menuItem.linkTarget.project.slug.current
            : menuItem.linkTarget.category
            ? "/" + menuItem.linkTarget.category.slug.current
            : menuItem.linkTarget.url
            ? "/" + menuItem.linkTarget.url
            : "/"
        }
      >
        {menuItem.title}
      </Link>
    </>
  );
}
