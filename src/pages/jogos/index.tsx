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
import { Link, PlusCircle, Settings, X } from "lucide-react";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
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
import { ITeam, ITeamsProps } from "@/interfaces/teams";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IGame } from "@/interfaces/games";

interface IPageGamesProps {
  games: IGame[];
  teams: ITeam[];
}

const Games = ({ games, teams }: IPageGamesProps) => {
  const session = useSession();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [gamesState, setGamestate] = useState<Array<IGame>>(games);
  const [teamsState, setTeamsState] = useState<Array<ITeam>>(teams);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const deleteGame = async (id: number) => {
    try {
      const res = await api.delete(
        `/game/${id}`,
        forceHeaders(session.data?.token)
      );

      toast.success(res.data.message);

      setGamestate((e) => {
        return e.filter((game: IGame) => game.id !== id);
      });
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
  };

  async function createGame({
    name,
    tshirt,
    team,
  }: z.infer<typeof formSchema>) {
    try {
      const teamSplited = team.split("|");

      const res = await api.post(
        `/game/`,
        {
          name: name,
          tshirt: tshirt,
          team_id: teamSplited[0],
        },
        forceHeaders(session.data?.token)
      );

      res.data.data.team = {};
      res.data.data.team.name = teamSplited[1];

      setGamestate([...gamesState, res.data.data]);

      form.reset({ name: "", tshirt: "" });
      toast.success(res.data.message);
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
  }

  const formSchema = z.object({
    name: z.string().min(8, {
      message: "O Nome do jogador precisa ter pelo menos 8 letras!",
    }),
    tshirt: z
      .string()
      .min(1, {
        message: "O número da camisa deve ser pelo menos 1.",
      })
      .max(99, {
        message: "O número da camisa deve ser no máximo 99.",
      }),
    team: z.string().min(1, {
      message: "Por favor, selecione um time!",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      tshirt: "",
      team: "",
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
              <span>Jogos</span>
              <Dialog>
                <DialogTrigger>
                  <SemiButton>
                    <PlusCircle></PlusCircle>
                  </SemiButton>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cadastrar novo jogo!</DialogTitle>
                    <DialogDescription>
                      <Form {...form}>
                        <form
                          className="w-full"
                          onSubmit={form.handleSubmit(createGame)}>
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

                          <FormField
                            control={form.control}
                            name="tshirt"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel>Número da camisa</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="10"
                                    {...field}
                                    type="number"
                                    inputMode="numeric"
                                    min={1}
                                    max={99}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="team"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Time</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Selecione o time" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {teamsState.map((e) => {
                                      return (
                                        <SelectItem
                                          key={e.id}
                                          value={`${e.id}|${e.name}`}>
                                          {e.name}
                                        </SelectItem>
                                      );
                                    })}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {isLoaded && (
                            <Button
                              variant={"default"}
                              className="w-full mt-4"
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
              Lista de todos os jogos cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gols do Time da casa</TableHead>
                  <TableHead>Gols do Time da visitante</TableHead>
                  <TableHead className="w-[40%]">Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gamesState.map((game) => (
                  <TableRow key={game.id}>
                    <TableCell>{game.home_team_goals}</TableCell>
                    <TableCell>{game.visitor_team_goals}</TableCell>
                    <TableCell className="font-medium">{game.date}</TableCell>
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
                            onClick={() => deleteGame(game.id)}
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

    const response = await api.get("/game", forceHeaders(session?.token));

    const responseTeams = await api.get("/team", forceHeaders(session?.token));

    const games = response.data.data;

    const teams = responseTeams.data.data;

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
        games,
        teams,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        games: [],
        teams: [],
      },
    };
  }
};

export default Games;
