import { LucideIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface IItemProps {
  link: string;
  isOpen: boolean;
  text: string;
  icon: LucideIcon;
}

const Item = ({ link, isOpen, text, icon }: IItemProps) => {
  return (
    <Link
      className={`flex w-full justify-start items-center gap-4 px-4 py-2 shadow rounded hover:bg-red-500/20 transiton-all duration-500 mt-4`}
      title={text}
      href={`/${link}`}>
      {icon &&
        React.createElement(icon, {
          className: `w-8 h-8 border border-red-500 p-2 rounded-lg ${
            isOpen ? "" : "ml-2"
          }`,
        })}
      <span className={`${isOpen ? "block" : "hidden"}`}>{text}</span>
    </Link>
  );
};

export default Item;
