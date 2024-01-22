import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  name: string;
}

const Header = ({ name }: HeaderProps) => {
  const router = useRouter();

  const HandleSingOut = async () => {
    await signOut();

    router.push("/");
  };

  return (
    <header className="flex h-8 px-4 border-b w-full font-bold justify-between items-center">
      <p className="font-bold">Olá, {name}</p>
      <Button onClick={HandleSingOut} variant={"link"}>
        Sair <LogOut className="ml-4 w-4 h-4" />
      </Button>
    </header>
  );
};
export default Header;
