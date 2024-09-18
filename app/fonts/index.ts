import * as fs from "node:fs/promises";
import * as path from "node:path";

export const runtime = "nodejs";

const permanentMarkerRegularFont = fs.readFile(
  path.join(path.resolve(process.cwd(), "public"), "PermanentMarker-Regular.ttf")
);

export const fonts = async () => {
  const fontData = await permanentMarkerRegularFont;
  return [
    {
      name: "PermanentMarker",
      data: fontData,
    },
  ];
};