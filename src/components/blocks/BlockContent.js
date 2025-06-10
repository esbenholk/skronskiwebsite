import { PortableText } from "@portabletext/react";

import { Image } from "./image";

const components = {
  types: {
    image: ({ value }) => <Image image={value} />,
  },
  marks: {
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const isExternal = href.startsWith("http");

      return (
        <a
          href={href}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noopener noreferrer" : undefined}
          onClick={() => console.log("clicked link", href)}
        >
          {children}
        </a>
      );
    },
  },
};

function BlockContent({ blocks }) {
  return (
    <PortableText
      value={blocks}
      projectId="qx8f23wj"
      dataset="production"
      serializers={{
        image: (props) => <Image image={props} />,
      }}
      components={components}
    />
  );
}

export default BlockContent;
