import { useState } from "react";
import { Button } from "../ui/button";
import { ChevronRight, LifeBuoy, MapPinnedIcon } from "lucide-react";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav
      className={`flex flex-col h-full py-4 border-r space-y-2 transiton-all duration-500 items-center justify-between ${
        isOpen ? "w-64" : "w-20"
      }`}>
      <div className="flex h-8 border-b w-full text-red-500 font-bold justify-center items-center">
        <LifeBuoy className="mr-2" />
        <span className={`${isOpen ? "inline" : "hidden"}`}>futsal.api</span>
      </div>
      <MapPinnedIcon className={`w-4 h-4`} />
      <div className="flex flex-col items-center justify-between px-4 w-full">
        <Button variant={"main"} className="w-full" onClick={handleOpen}>
          <ChevronRight className={`w-4 h-4 ${isOpen && "rotate-180"}`} />
        </Button>
      </div>
    </nav>
  );
};

export default Sidebar;
