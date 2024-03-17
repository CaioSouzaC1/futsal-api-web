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

interface IPagePlayerProps {
  players: IPlayer[];
  teams: ITeam[];
}

const Players = ({ players, teams }: IPagePlayerProps) => {
  const session = useSession();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [playersState, setPlayerState] = useState<Array<IPlayer>>(players);
  const [teamsState, setTeamsState] = useState<Array<ITeam>>(teams);

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
        return e.filter((player: IPlayer) => player.id !== id);
      });
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
  };

  async function createPlayer({
    name,
    tshirt,
    team,
  }: z.infer<typeof formSchema>) {
    try {
      const teamSplited = team.split("|");

      const res = await api.post(
        `/player/`,
        {
          name: name,
          tshirt: tshirt,
          team_id: teamSplited[0],
        },
        forceHeaders(session.data?.token)
      );

      res.data.data.team = {};
      res.data.data.team.name = teamSplited[1];

      setPlayerState([...playersState, res.data.data]);

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

    const responseTeams = await api.get("/team", forceHeaders(session?.token));

    const players = response.data.data;

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
        players,
        teams,
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
