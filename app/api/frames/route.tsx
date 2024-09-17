/* eslint-disable react/jsx-key */
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/frames",
});
const handleRequest = frames(async () => {
  return {
    image: <span>Test</span>,
    buttons: [<Button action="post">Click me</Button>],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
