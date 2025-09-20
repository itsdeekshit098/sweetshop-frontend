import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { AuthProvider } from "../context/AuthContext";


export const metadata = {
  title: "Sweet Shop",
  description: "Sweet Shop Management",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
        {/* <Header /> */}
        <main className="flex-1 container mx-auto  bg-[rgb(247,247,247)]">{children}</main>
        {/* <Footer /> */}
        </AuthProvider>
      </body>
    </html>
  );
}
