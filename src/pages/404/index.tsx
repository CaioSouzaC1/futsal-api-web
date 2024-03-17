import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <main className="flex flex-wrap h-screen">
      <div className="w-full lg:w-[50%] flex flex-col justify-center items-center bg-red-500">
        <h1 className="text-4xl font-bold text-white mb-4">Página 404</h1>
        <XCircle size={32} className="font-bold text-white"></XCircle>
      </div>
      <div className="w-full lg:w-[50%] p-4 flex flex-col justify-center items-center">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>O Que pode ter acontecido?</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  A Url digitada está correta?
                </AccordionTrigger>
                <AccordionContent>
                  Confirme a url em que você se encontra, veja se não tem algum
                  erro.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  Como eu volto ao sistema?
                </AccordionTrigger>
                <AccordionContent>
                  <Link href={"/"} className="underline">
                    Clique aqui e vamos te redirecionar!
                    </Link>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default NotFound;
