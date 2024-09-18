import { fetchMetadata } from "frames.js/next";
 
export async function generateMetadata() {
  return {
    title: "My page 123",
    other: {
      // ...
      ...(await fetchMetadata(
        // provide full URL to your /frames endpoint
        new URL(
          "/api/frames",
          process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : "http://localhost:3000"
        )
      )),
    },
  };
}
 
export default function Page() {
  return <span>My existing page</span>;
}