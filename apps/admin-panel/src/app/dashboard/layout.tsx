"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import Header from "./components/Header";
import SideBar from "./components/SideBar";

interface DashBoardLayoutProps {
  children: React.ReactNode;
}

const queryClient = new QueryClient();

const layout = ({ children }: DashBoardLayoutProps) => {
  return (
    <div className="w-full">
      <Header />
      <div className="w-full min-h-full flex overflow-hidden">
        <SideBar />

        <QueryClientProvider client={queryClient}>
          <main className="w-full h-[calc(100vh-82px)] overflow-auto">{children}</main>
        </QueryClientProvider>
      </div>
    </div>
  );
};

export default layout;
