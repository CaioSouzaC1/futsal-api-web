"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getSession, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().email({
    message: "Este campo precisa ser um email.",
  }),
  password: z.string().min(6, {
    message: "A senha precisa ter pelo menos 6 caracteres",
  }),
  confirm_password: z.string().min(6, {
    message: "A senha precisa ter pelo menos 6 caracteres",
  }),
});

const Home = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  async function onSubmit({
    email,
    password,
    confirm_password,
  }: z.infer<typeof formSchema>) {
    const result = await signIn("credentials", {
      email,
      password,
      confirm_password,
      redirect: false,
      callbackUrl: "/dashboard",
    });

    if (result && result.ok) {
      router.push("/dashboard");
      toast.success("Bem vindo!");
    } else {
      toast.error("Erro ao efetuar login!");
      router.push("/");
    }
  }

  return (
    <main className="flex w-full flex-wrap h-full min-h-screen">
      <div className="w-full lg:w-[65%]">
        <Image
          alt="Descrição da imagem"
          width={2000}
          height={2000}
          className="h-full object-cover"
          src={"/images/base.jpg"}></Image>
      </div>
      <div className="w-full lg:w-[35%]">
        <div className="w-full h-full flex justify-center items-center flex-col">
          <div className="w-full flex flex-wrap justify-center">
            <h1 className="text-2xl">
              Bem vindo ao{" "}
              <span className="text-red-500 font-bold mb-2">futsal.api</span>
            </h1>
            <h2 className="text-lg mb-8">
              O Sistema de gerenciamento de campeonato!
            </h2>
          </div>
          <div className="w-[80%]">
            <Form {...form}>
              <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="jhon@doe.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="*********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem className="mb-4">
                      <FormLabel>Confirmar senha</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="*********"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button className="px-0 text-red-500 mb-8" variant={"link"}>
                  Perdi minha senha
                </Button>
                <Button variant={"main"} className="w-full" type="submit">
                  Entrar
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;
