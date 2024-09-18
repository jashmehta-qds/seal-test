import Header from "@/components/Header";
import SessionProviderWrapper from "@/providers/SessionProviderWrapper";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={` antialiased`}
      >
        <SessionProviderWrapper>
          <div className="flex justify-center sticky top-5">
            <Header />
          </div>

          {children}
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
