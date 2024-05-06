"use client";

import Header from "./components/Header";
import SideBar from "./components/SideBar";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

const layout = ({ children }: DashBoardLayoutProps) => {
  return (
    <div className="w-full">
      <Header />
      <div className="w-full min-h-full flex overflow-hidden">
        <SideBar />

        <main className="w-full h-[calc(100vh-82px)] overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default layout;
