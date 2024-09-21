import { fonts } from "@/app/fonts";
import { createClient } from "@vercel/kv";
import { Button, createFrames } from "frames.js/next";

const frames = createFrames({
  basePath: "/api/custom-frames",
  imagesRoute: null,
  imageRenderingOptions: async () => {
    return {
      imageOptions: {
        fonts: await fonts(),
      },
    };
  },
});

interface CustomFrame {
  title: string;
  createdByFid: string;
  voters: { fId: string; isVoteYes: boolean }[];
}
const handleRequest = frames(async (ctx) => {
  const { protocol, host, searchParams } = ctx.url;

  const frameId = await searchParams.get("frameId");
  console.log("frameId: " + frameId, searchParams);

  if (frameId) {
    const customFramesDb = createClient({
      url: process.env.KV_CUSTOM_REST_API_URL,
      token: process.env.KV_CUSTOM_REST_API_TOKEN,
    });

    try {
      const customFrame = await customFramesDb.hgetall(frameId);
      const result = customFrame as unknown as CustomFrame;
      const userFid = ctx.message?.requesterFid?.toString();
      const votedUser = result?.voters?.find((x) => x.fId === userFid);

      const frameDetails = {
        result,
        hasUserVoted: !!votedUser,
        hasUserVotedYes: votedUser && votedUser.isVoteYes,
        hasUserVotedNo: votedUser && !votedUser.isVoteYes,

        updateVote: (isVoteYes: boolean) => {
          if (!userFid || frameDetails.hasUserVoted) {
            return;
          }

          customFramesDb.hset(frameId, {
            ...result,
            voters: [...(result?.voters || []), { fId: userFid, isVoteYes }],
          });
        },
        getVoteMetrics: () => {
          return {
            totalYesVotes:
              result?.voters?.filter((x) => x.isVoteYes)?.length || 0,
            totalVotes: result?.voters.length,
          };
        },
      };

      let imageUrl = "";

      switch (ctx.searchParams?.step) {
        case "voted":
          if (userFid) {
            const vote = ctx.pressedButton?.index === 1 ? 1 : 0;

            if (!frameDetails.hasUserVoted) {
              frameDetails.updateVote(vote === 1);
              imageUrl = `${protocol}//${host}/api/image/participated?action=${vote}`;
            } else {
              imageUrl = `${protocol}//${host}/api/image/participated?action=${
                frameDetails.hasUserVotedYes ? 1 : 0
              }`;
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
                target={{ query: { step: "result", frameId } }}
                key={"result"}
              >
                View Positions
              </Button>,
            ],
          };

        case "result":
          const { totalYesVotes, totalVotes } = frameDetails.getVoteMetrics();
          imageUrl = `${protocol}//${host}/api/image/result?yesVotes=${totalYesVotes}&totalVotes=${totalVotes}&title=${frameDetails.result?.title}`;

          return {
            title: frameDetails.result?.title,
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
          imageUrl = `${protocol}//${host}/api/image/welcome?title=${frameDetails.result?.title}`;

          return {
            title: frameDetails.result?.title,
            image: imageUrl,
            buttons: [
              <Button
                action="post"
                target={{ query: { step: "voted", frameId, } }}
                key={"yes"}
              >
                Yes
              </Button>,
              <Button
                action="post"
                key={"no"}
                target={{ query: { step: "voted", frameId } }}
              >
                No
              </Button>,
            ],
          };
      }
    } catch (error) {
      console.error("Error fetching or processing frame:", error);
      return {
        title: "Error",
        image: `${protocol}//${host}/api/image/error`,
        buttons: [
          <Button action="link" target={"https://www.google.com"} key={"home"}>
            Go Home
          </Button>,
        ],
      };
    }
  } else {
    return {
      title: "Welcome to the Seal",
      image: `${protocol}//${host}/api/image/welcome`,
      buttons: [
        <Button
          action="post"
          target={{ query: { step: "voted" } }}
          key={"start"}
        >
          Start
        </Button>,
      ],
    };
  }
});

export const GET = handleRequest;
export const POST = handleRequest;
