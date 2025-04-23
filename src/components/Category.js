import React, { useEffect, useState, useContext } from "react";
import { Suspense } from "react";
import sanityClient from "../client";
import { useParams } from "react-router-dom";
import Projects from "./blocks/ProjectSorting";

import BlockContent from "./blocks/BlockContent";
import AppContext from "../globalState";

export default function Category() {
  const { slug } = useParams();

  const [category, setCategory] = useState();
  const myContext = useContext(AppContext);
  const projectList = myContext.projectList;
  const sortedProjectList = [];

  useEffect(() => {
    sanityClient
      .fetch(
        `*[_type == "category" && slug.current=="${slug}"]{
          description,
          title, 
          slug, 

        }`
      )
      .then((data) => {
        setCategory(data[0]);
      })
      .catch(console.error);
  }, [slug]);

  for (var i = 0; i < projectList.length; i++) {
    var project = projectList[i];
    if (
      project.categories.find(
        (category) => category.title.toLowerCase() == slug
      )
    ) {
      sortedProjectList.push(project);
    }
  }
  return (
    <div className="content-container ">
      <div className="fullWidthPadded category_details">
        {category && (
          <>
            {" "}
            <h1 className="noMargin categoryTitle">{category.title}</h1>
            <>
              {category.description && (
                <div className="subheadline">
                  <BlockContent blocks={category.description} />
                </div>
              )}
            </>
          </>
        )}
      </div>

      <Suspense fallback={null}>
        {sortedProjectList && sortedProjectList.length > 0 ? (
          <Projects projectList={sortedProjectList} />
        ) : null}
      </Suspense>
    </div>
  );
}
