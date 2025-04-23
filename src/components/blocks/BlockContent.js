import PortableText from "react-portable-text";
import React from "react";
import { Image } from "./image";

function BlockContent({ blocks }) {
  return (
    <PortableText
      content={blocks}
      projectId="qx8f23wj"
      dataset="production"
      serializers={{
        image: (props) => <Image image={props} />,
      }}
    />
  );
}

export default BlockContent;
