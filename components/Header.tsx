"use client";

import {
  AuthKitProvider,
  SignInButton,
  StatusAPIResponse,
} from "@farcaster/auth-kit";
import { getCsrfToken, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useCallback, useState } from "react";

import "@farcaster/auth-kit/styles.css";
import Image from "next/image";


const config = {
  relay: "https://relay.farcaster.xyz",
};
export default function Header() {
  return (
    <header
      className={`sticky top-0 z-50 bg-white bg-opacity-70 backdrop-blur-lg rounded-lg shadow-md min-w-[400px] border-2 border-slate-500`}
    >
      <div className="flex justify-between items-center py-3 px-3 gap-4 ">
        <div className="flex items-center">
          <Image src="/logo.png" alt="wager-logo" width={70} height={70} />
          <Link href="/">
            <span className="font-monospace font-semibold italic text-3xl tracking-wide">wager </span>
          </Link>
        </div>
        <AuthKitProvider config={config}>
          <Content />
        </AuthKitProvider>
      </div>
    </header>
  );
}

function Content() {
  const [error, setError] = useState(false);

  const getNonce = useCallback(async () => {
    const nonce = await getCsrfToken();
    if (!nonce) throw new Error("Unable to generate nonce");
    return nonce;
  }, []);

  const handleSuccess = useCallback((res: StatusAPIResponse) => {
    signIn("credentials", {
      message: res.message,
      signature: res.signature,
      name: res.username,
      pfp: res.pfpUrl,
      redirect: false,
    });
  }, []);

  return (
    <div>
      <div>
        <SignInButton
          nonce={getNonce}
          onSuccess={handleSuccess}
          onError={() => setError(true)}
          onSignOut={() => signOut()}
        />
        {error && <div>Unable to sign in at this time.</div>}
      </div>
    </div>
  );
}

// function Profile() {
//   const { data: session } = useSession();

//   return session ? (
//     <div style={{ fontFamily: "sans-serif" }}>
//       <p>Signed in as {session.user?.name}</p>
//       <p>
//         <button
//           type="button"
//           style={{ padding: "6px 12px", cursor: "pointer" }}
//           onClick={() => signOut()}
//         >
//           Click here to sign out
//         </button>
//       </p>
//     </div>
//   ) : (
//     <p>
//       Click the &quot;Sign in with Farcaster&quote; button above, then scan the
//       QR code to sign in.
//     </p>
//   );
// }
