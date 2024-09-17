import { createAppClient, viemConnector } from "@farcaster/auth-client";
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";

const handler = (request: NextRequest, res: NextApiResponse) => {
  const req = request as unknown as NextApiRequest;
  return NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: "Sign in with Farcaster",
        credentials: {
          message: {
            label: "Message",
            type: "text",
            placeholder: "0x0",
          },
          signature: {
            label: "Signature",
            type: "text",
            placeholder: "0x0",
          },
          // In a production app with a server, these should be fetched from
          // your Farcaster data indexer rather than have them accepted as part
          // of credentials.
          name: {
            label: "Name",
            type: "text",
            placeholder: "0x0",
          },
          pfp: {
            label: "Pfp",
            type: "text",
            placeholder: "0x0",
          },
        },
        async authorize(credentials) {
          const {
            body: { csrfToken },
          } = req;

          const appClient = createAppClient({
            ethereum: viemConnector(),
          });

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: "http://localhost:3000/",
            nonce: csrfToken,
          });
          const { success, fid } = verifyResponse;

          if (!success) {
            return null;
          }

          return {
            id: fid.toString(),
            name: credentials?.name,
            image: credentials?.pfp,
          };
        },
      }),
    ],
  });
};

export { handler as GET, handler as POST };
