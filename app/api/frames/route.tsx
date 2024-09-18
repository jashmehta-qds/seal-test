/* eslint-disable react/jsx-key */
import { fonts } from "@/app/fonts";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/frames",
  imageRenderingOptions: async () => {
    return {
      imageOptions: {
        fonts: await fonts(),
      },
    };
  },
});
const handleRequest = frames(async () => {
  const imageUrl = `http://localhost:3000/api/image`;
  return {
    title: "Frames Demo",
    image: imageUrl,
    buttons: [
      <Button action="post">Yes</Button>,
      <Button action="post">No</Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
