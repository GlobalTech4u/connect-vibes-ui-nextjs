import StoreProvider from "@/components/StoreProvider/StoreProvider";

import "@/styles/globals.css";
import "@/styles/variables.css";

export default function RootLayout({ children }) {
  return (
    <StoreProvider>
      <html lang="en">
        <head>
          <title>Connect Vibes</title>
          <meta name="description" content="Connecting people..." />
          <link rel="icon" href="/images/connect-vibes-logo.png" sizes="any" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" />
          <link
            href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Ubuntu:ital,wght@0,300;0,400;0,500;0,700;1,300;1,400;1,500;1,700&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>{children}</body>
      </html>
    </StoreProvider>
  );
}
