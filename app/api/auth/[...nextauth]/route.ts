import { createAppClient, viemConnector } from "@farcaster/auth-client";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
interface RouteHandlerContext {
  params: { nextauth: string[] };
}
const handler = async (request: NextRequest, context: RouteHandlerContext) => {
  const reqClone = request.clone();

  return NextAuth(request as NextRequest, context, {
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
          const body = await reqClone.formData();
          const csrfToken = body.get("csrfToken")?.toString() || "";
          console.log(csrfToken);

          // Now you can access the body params

          const appClient = createAppClient({
            ethereum: viemConnector(),
          });

          const verifyResponse = await appClient.verifySignInMessage({
            message: credentials?.message as string,
            signature: credentials?.signature as `0x${string}`,
            domain: "localhost:3000",
            nonce: csrfToken, // Use the csrfToken from the body
          });

          if (!verifyResponse?.success) {
            return null;
          }

          return {
            id: verifyResponse.fid.toString(),
            name: credentials?.name,
            image: credentials?.pfp,
          };
        },
      }),
    ],
  });
};

export { handler as GET, handler as POST };
