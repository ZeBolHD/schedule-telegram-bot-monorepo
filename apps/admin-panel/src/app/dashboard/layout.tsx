"use client";

import { TableGroupsDataContextProvider } from "@/context/TableGroupsDataContext";

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
        <TableGroupsDataContextProvider>
          <main className="w-full h-[calc(100vh-82px)] overflow-auto">
            {children}
          </main>
        </TableGroupsDataContextProvider>
      </div>
    </div>
  );
};

export default layout;
