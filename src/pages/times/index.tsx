import AppLayout from "@/_layouts/app";
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
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
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
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

interface ITeamsProps {
  teams: ITeam[];
}

interface ITeam {
  id: number;
  name: string;
  points: number;
  scored_goals: number;
  conceded_goals: number;
  created_at: string;
  updated_at: string;
  players: any[];
}

const Times = ({ teams }: ITeamsProps) => {
  const session = useSession();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [teamsState, setTeamsState] = useState<ITeam[]>(teams);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const deleteTeam = async (id: number) => {
    try {
      const res = await api.delete(
        `/team/${id}`,
        forceHeaders(session.data?.token)
      );

      toast.success(res.data.message);

      setTeamsState((e) => {
        return e.filter((team) => team.id !== id);
      });
    } catch (error) {
      console.error(error);
      defaultErrorToast();
    }
  };

  async function createTeam({ name }: z.infer<typeof formSchema>) {
    console.log(name);
  }

  const formSchema = z.object({
    name: z.string().min(8, {
      message: "O Nome do time precisa ter pelo menos 8 letras!",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <main>
      <AppLayout>
        <Card className="mx-4">
          <CardHeader>
            <CardTitle className="w-full flex justify-between">
              <span>Times</span>
              <AlertDialog>
                <AlertDialogTrigger>
                  <SemiButton>
                    <PlusCircle></PlusCircle>
                  </SemiButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Criar novo time!</AlertDialogTitle>
                    <AlertDialogDescription>
                      <Form {...form}>
                        <form
                          className="w-full"
                          onSubmit={form.handleSubmit(createTeam)}>
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="mb-4">
                                <FormLabel>Nome do time</FormLabel>
                                <FormControl>
                                  <Input placeholder="Corinthians" {...field} />
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
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="w-full">
                      Cancelar
                    </AlertDialogCancel>

                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardTitle>
            <CardDescription>
              Lista de todos os times cadastrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Pontos</TableHead>
                  <TableHead>Gols</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamsState.map((team) => (
                  <TableRow key={team.id}>
                    <TableCell className="font-medium">{team.name}</TableCell>
                    <TableCell>{team.points}</TableCell>
                    <TableCell>{team.scored_goals}</TableCell>
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
                            onClick={() => deleteTeam(team.id)}
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

    const response = await api.get("/team", forceHeaders(session?.token));

    const teams = response.data.data;

    // if (!session?.user) {
    //   return {
    //     redirect: {
    //       destination: "/",
    //     },
    //   };
    // }

    return {
      props: {
        teams,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        teams: [],
      },
    };
  }
};

export default Times;
