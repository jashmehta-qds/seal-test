import { promises as fs } from "fs";
import { ImageResponse } from "next/og";
import path from "path";

const handleRequest = async () => {
  const imagePath = path.join(process.cwd(), "public", "question.jpg");
  const fontPath = path.join(process.cwd(), "public", "PermanentMarker-Regular.ttf");
  const fontBuffer = await fs.readFile(fontPath);
  const imageBuffer = await fs.readFile(imagePath);
  const base64Image = `data:image/jpeg;base64,${imageBuffer.toString(
    "base64"
  )}`;

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
          borderRadius: "12px",
          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)",
        }}
      >
        <div tw="flex flex-col items-start w-full h-full text-center tracking-wider">
          <span
            tw="flex p-[15%]"
            style={{
              fontFamily: "PermanentMarker",
              fontSize: 48,
              color: "white",
            }}
          >
            Will there be over 10k Kramer predictions before 9/29 midnight?
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
            data: fontBuffer
        }
      ]
    }
  );
};

export const GET = handleRequest;
export const POST = handleRequest;
