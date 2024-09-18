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
const handleRequest = frames(async (ctx) => {

  const { protocol, host } = ctx.url;
  const imageUrl = `${protocol}//${host}/api/image`;
  return {
    title: "10k Predictions on Kramer By 9/29 ? 🚀",
    image: imageUrl,
    buttons: [
      <Button action="post">Yes</Button>,
      <Button action="post">No</Button>,
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
