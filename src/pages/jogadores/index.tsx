import AppLayout from "@/_layouts/app";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/services/api";
import { forceHeaders } from "@/utils/forceHeaders";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlusCircle, Settings, X } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SemiButton } from "@/components/ui/semi-button";
import toast from "react-hot-toast";
import { defaultErrorToast } from "@/utils/defaultErrorToast";
import Loader from "@/components/loader";

interface IPlayersProps {
  players: IPlayer[];
}

interface ITeam {
  id: number;
  name: string;
  points: number;
  scored_goals: number;
  conceded_goals: number;
  created_at: string;
  updated_at: string;
}

interface IPlayer {
  id: number;
  name: string;
  tshirt: number;
  team_id: number;
  created_at: string;
  updated_at: string;
  players: any[];
  team: ITeam;
}

const Players = ({ players }: IPlayersProps) => {
  const session = useSession();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [playersState, setPlayerState] = useState<IPlayer[]>(players);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const deleteTeam = async (id: number) => {
    try {
      const res = await api.delete(
        `/player/${id}`,
        forceHeaders(session.data?.token)
      );

      toast.success(res.data.message);

      setPlayerState((e) => {
        return e.filter((player) => player.id !== id);
      });
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
  };

  async function createPlayer({ name }: z.infer<typeof formSchema>) {
    try {
      const res = await api.post(
        `/player/`,
        {
          name: name,
        },
        forceHeaders(session.data?.token)
      );

      toast.success(res.data.message);

      setPlayerState([...playersState, res.data.data]);

      form.reset({ name: "" });
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
  }

  const formSchema = z.object({
    name: z.string().min(8, {
      message: "O Nome do jogador precisa ter pelo menos 8 letras!",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  if (!isLoaded) {
    return (
      <main>
        <AppLayout>
          <Loader></Loader>
        </AppLayout>
      </main>
    );
  }

  return (
    <main>
      <AppLayout>
        <Card className="mx-4">
          <CardHeader>
            <CardTitle className="w-full flex justify-between">
              <span>Jogadores</span>
              <Dialog>
                <DialogTrigger>
                  <SemiButton>
                    <PlusCircle></PlusCircle>
                  </SemiButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar novo jogador!</DialogTitle>
                    <DialogDescription>
                      <Form {...form}>
                        <form
                          className="w-full"
                          onSubmit={form.handleSubmit(createPlayer)}>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel>Nome do jogador</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Cristiano Ronaldo"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {isLoaded && (
                            <Button
                              variant={"default"}
                              className="w-full"
                              type="submit">
                              Criar
                            </Button>
                          )}
                        </form>
                      </Form>
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    {/* <DialogCancel className="w-full">
                      Voltar
                    </DialogCancel> */}

                    {/* <DialogAction>Continue</DialogAction> */}
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardTitle>
            <CardDescription>
              Lista de todos os jogadores cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[70%]">Nome</TableHead>
                  <TableHead>Camisa</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {playersState.map((player) => (
                  <TableRow key={player.id}>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.tshirt}</TableCell>
                    <TableCell>{player.team.name}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          {isLoaded && (
                            <div className="flex">
                              Editar
                              <Settings className="pl-2 text-sm"></Settings>
                            </div>
                          )}
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => deleteTeam(player.id)}
                            className="cursor-pointer text-red-500">
                            Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </AppLayout>
    </main>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);

    const response = await api.get("/player", forceHeaders(session?.token));

    const players = response.data.data;

    if (!session) {
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

    return {
      props: {
        players,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        players: [],
      },
    };
  }
};

export default Players;
