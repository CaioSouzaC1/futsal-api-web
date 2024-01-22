import Sidebar from "@/components/sidebar";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4 py-4">{children}</div>
    </div>
  );
};

export default AppLayout;
