import { promises as fs } from "fs";
import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import path from "path";

const handleRequest = async (req: NextRequest) => {
  const imagePath = path.join(process.cwd(), "public", "result.png");
  const fontPath = path.join(
    process.cwd(),
    "public",
    "PermanentMarker-Regular.ttf"
  );
  const fontBuffer = await fs.readFile(fontPath);
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  const url = new URL(req.url);
  const yesVotes =parseInt(url.searchParams.get("yesVotes") || "0");
  const totalVotes = parseInt(url.searchParams.get("totalVotes") || "0"); 
  const yesPercent = Math.floor(yesVotes*100/totalVotes)
  const yesFloor = Math.floor(yesPercent/10)
  return new ImageResponse(
    (
      <div
        tw="flex flex-col w-full h-full p-6 rounded-lg shadow-xl"
        style={{
          backgroundImage: `url(${base64Image})`,
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: "24px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)", // shadow for modern look
        }}
      >
        {/* Top content displaying "Wagers: 28" */}
        <div tw="flex justify-center">
          <span tw="text-white text-[56px] font-bold bg-black bg-opacity-60 px-2 pb-4" style={{borderRadius: "8px 8px 0 0"}}>
            Total Votes: {totalVotes}
          </span>
         
        </div>
        <div tw="flex justify-center">
        <span tw="text-white text-[28px] font-bold bg-black bg-opacity-60 px-2 pb-4 rounded-lg">
          10k Predictions on Kramer By 9/29 ? 🚀
          </span> 
         
        </div>

        {/* Spacer div to push the rest of the content to the bottom */}
        <div tw="flex flex-grow"> </div>

        {/* Bottom content (the health bar) */}
        <div tw="flex flex-col items-start w-full h-auto text-center tracking-wider">
          <span
            tw="text-center font-bold text-[42px] text-white flex justify-center items-center w-full mb-2"
            style={{ textShadow: "0 0 20px rgba(0, 0, 0, 1)" }}
          >
            Results:
          </span>

          <div
            tw="flex w-full h-24 bg-red-800 rounded-none overflow-hidden relative"
            style={{
              border: "4px solid #333",
              boxShadow: "0 0 10px rgba(0, 255, 0, 0.5)",
            }}
          >
            {/* Health Bar Fill */}
            <div tw="flex h-full w-full space-x-2">
              {/* 6 filled blocks to represent 65% */}
              {[...Array(yesFloor)].map((_, index) => (
                <div
                  key={index}
                  tw="h-full bg-green-500 rounded-sm flex-grow border-2 border-[#333]"
                  style={{
                    background: "linear-gradient(90deg, #22c55e, #16a34a)", // Green gradient for visual effect
                    flex: "1", // Ensures all blocks are equal size
                  }}
                />
              ))}

              {/* 4 empty blocks representing 35% */}
              {[...Array(10-yesFloor)].map((_, index) => (
                <div
                  key={index}
                  tw="h-full bg-transparent rounded-sm flex-grow"
                  style={{
                    border: "1px solid #333", // Border for the empty blocks
                    flex: "1", // Ensures all blocks are equal size
                  }}
                />
              ))}
            </div>

            {/* Percentage labels */}
            <div
              className="w-full"
              tw="absolute inset-0 flex justify-between items-center text-white font-bold px-4"
            >
              <div tw="flex flex-col" style={{ fontSize: "36px" }}>
                <div tw="flex">{yesPercent} %</div>
                <div tw="flex" style={{ fontSize: "24px" }}>
                  (Yes)
                </div>
              </div>

              <div tw="flex flex-col" style={{ fontSize: "36px" }}>
                <div tw="flex">{100 - yesPercent} %</div>
                <div tw="flex" style={{ fontSize: "24px" }}>
                  (No)
                </div>
              </div>
            </div>
          </div>
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
