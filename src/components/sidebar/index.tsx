import { useState } from "react";
import { Button } from "../ui/button";
import {
  ChevronRight,
  FlagTriangleRight,
  LifeBuoy,
  PersonStanding,
  PieChart,
  ShieldHalfIcon,
} from "lucide-react";
import Item from "./item";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`flex flex-col h-full py-2 border-r space-y-2 transiton-all duration-500 justify-between items-center ${
        isOpen ? "w-64" : "w-20"
      }`}>
      <div className="flex flex-col w-full">
        <div className="flex h-8 border-b w-full text-red-500 font-bold justify-center">
          <LifeBuoy />
          <span className={`${isOpen ? "inline ml-2" : "hidden"}`}>
            futsal.api
          </span>
        </div>

        <Item
          link="dashboard"
          isOpen={isOpen}
          text="Dashboard"
          icon={PieChart}
        />
        <Item link="times" isOpen={isOpen} text="Times" icon={ShieldHalfIcon} />
        <Item
          link="jogadores"
          isOpen={isOpen}
          text="Jogadores"
          icon={PersonStanding}
        />
        <Item
          link="jogos"
          isOpen={isOpen}
          text="Jogos"
          icon={FlagTriangleRight}
        />
      </div>

      <div className="flex flex-col items-center justify-between px-4 w-full">
        <Button variant={"main"} className="w-full" onClick={handleOpen}>
          <ChevronRight className={`w-4 h-4 ${isOpen && "rotate-180"}`} />
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
