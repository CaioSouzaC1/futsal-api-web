import Header from "@/components/header";
import ProgressBar from "@/components/progress";
import Sidebar from "@/components/sidebar";
import { useSession } from "next-auth/react";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const session = useSession();

  return (
    <div className="flex h-screen">
      <ProgressBar />
      <Sidebar />
      <div className="flex flex-1 flex-col gap-4 py-4">
        <Header name={session.data?.user?.user?.name!} />
        {children}
      </div>
    </div>
  );
};

export default AppLayout;
