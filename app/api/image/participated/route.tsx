import { promises as fs } from "fs";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import path from "path";

const handleRequest = async (req: NextRequest) => {

  const url = new URL(req.url);
  const isVotedYes = url.searchParams.get("action") === "1";
  const imagePath = path.join(
    process.cwd(),
    "public",
    isVotedYes ? "voted-yes.png" : "voted-no.png"
  );
  const fontPath = path.join(
    process.cwd(),
    "public",
    "PermanentMarker-Regular.ttf"
  );
  const fontBuffer = await fs.readFile(fontPath);
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-6 rounded-lg"
        style={{
          backgroundImage: `url(${base64Image})`,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
          position: "relative",
        }}
      >
        <div tw="flex flex-col items-start w-full h-full text-center tracking-wider">
          <div
            tw={`w-60 h-40 bg-black rounded-xl ${
              isVotedYes ? "opacity-70" : "opacity-90"
            } flex flex-col items-center justify-center`}
            style={{
              boxShadow: `0px 4px 8px 6px  ${
                isVotedYes ? "rgb(22, 163, 74)" : "rgb(185, 28, 28)"
              }`,
            }}
          >
            <span tw="text-[28px] text-white">You Voted</span>
            <span
              tw={`text-[46px] ${
                isVotedYes ? "text-green-600" : "text-red-600"
              }`}
            >
              {isVotedYes ? "Yes" : "No"}
            </span>
          </div>
        </div>
        {/* Footer Overlay */}
        <div
          tw="flex"
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100vw",
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "white",
            textAlign: "center",
            padding: "16px",
          }}
        >
          <span
            tw="p-auto m-auto"
            style={{
              fontSize: "32px",
            }}
          >
            🤑 You have already gamboooled away your vote , check options below
          </span>
        </div>
      </div>
    ),
    {
      headers: {
        key: "Cache-Control",
        value: "public, max-age=10, must-revalidate",
      },
      height: 630,
      width: 1200,
      fonts: [
        {
          name: "PermanentMarker",
          data: fontBuffer,
        },
      ],
    }
  );
};

export const GET = handleRequest;
export const POST = handleRequest;
