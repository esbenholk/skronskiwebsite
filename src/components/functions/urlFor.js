import sanityClient from "../../client";
import imageUrlBuilder from "@sanity/image-url";

// Get a pre-configured url-builder from your sanity client
const builder = imageUrlBuilder(sanityClient);

export default function urlFor(source) {
  return builder.image(source);
}
