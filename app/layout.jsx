import Header from "../components/Header";
import "./global.css";

export const metadata = {
  title: "Next.js",
  description: "Generated by Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <Header />

        <main className="container mx-auto p-10">{children}</main>

        <footer className="text-gray-400 text-center text-xs py-5">
          <p>
            Copyright &copy; {new Date().getFullYear()} - All rights reserved
          </p>
        </footer>
      </body>
    </html>
  );
}
