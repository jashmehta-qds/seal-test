import { fonts } from "@/app/fonts";
import { createClient } from "@vercel/kv";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/api/frames",
  imagesRoute: null,
  imageRenderingOptions: async () => {
    return {
      imageOptions: {
        fonts: await fonts(),
      },
    };
  },
});
const handleGetRequest = frames(async (ctx) => {
  const { protocol, host } = ctx.url;
  console.log("::", JSON.stringify(ctx));
  let imageUrl = "";
  let fId: string | undefined = undefined;
  const yesVoters = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  const noVoters = createClient({
    url: process.env.KV_NO_REST_API_URL,
    token: process.env.KV_NO_REST_API_TOKEN,
  });
  switch (ctx.searchParams?.step) {
    case "voted":
      fId = ctx.message?.requesterFid?.toString();

      if (fId) {
        const hasVotedYes = await yesVoters.hgetall(fId);
        const hasVotedNo = await noVoters.hgetall(fId);
        const isAlreadyVoted = hasVotedYes || hasVotedNo;
        // onyl two states currently in dev (yes - no)
        const vote = ctx.pressedButton?.index === 1 ? 1 : 0;
        console.log("::::", isAlreadyVoted, vote);

        if (!isAlreadyVoted) {
          if (vote === 1) {
            await yesVoters.hset(fId, { voted: true });
          } else {
            await noVoters.hset(fId, { voted: true });
          }
          imageUrl = `${protocol}//${host}/api/image/participated?action=${vote}`;
        } else if (hasVotedYes) {
          imageUrl = `${protocol}//${host}/api/image/participated?action=1`;
        } else {
          imageUrl = `${protocol}//${host}/api/image/participated?action=0`;
        }
      }

      return {
        title: "You already cast Yes 🚀",
        image: imageUrl,
        buttons: [
          <Button
            action="link"
            target={"https://www.google.com"}
            key={"follow"}
          >
            Follow Kramer for Updates
          </Button>,
          <Button
            action="post"
            target={{ query: { step: "result" } }}
            key={"result"}
          >
            View Positions
          </Button>,
        ],
      };
    case "result":
      fId = ctx.message?.requesterFid?.toString();
      const hasVotedYes = await yesVoters.dbsize();
      const hasVotedNo = await noVoters.dbsize();
      const totalVotes = hasVotedYes + hasVotedNo;

      imageUrl = `${protocol}//${host}/api/image/result?yesVotes=${hasVotedYes}&totalVotes=${totalVotes}`;
      return {
        title: "Result: 10k Predictions on Kramer By 9/29 ? 🚀",
        image: imageUrl,
        buttons: [
          <Button
            action="link"
            target={"https://www.google.com"}
            key={"follow"}
          >
            Follow Kramer for Updates
          </Button>,
        ],
      };
    default:
      imageUrl = `${protocol}//${host}/api/image/welcome`;

      return {
        title: "10k Predictions on Kramer By 9/29 ? 🚀",
        image: imageUrl,
        buttons: [
          <Button
            action="post"
            target={{ query: { step: "voted" } }}
            key={"yes"}
          >
            Yes
          </Button>,
          <Button
            action="post"
            key={"no"}
            target={{ query: { step: "voted" } }}
          >
            No
          </Button>,
        ],
      };
  }
});

export const GET = handleGetRequest;
export const POST = handleGetRequest;
