import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ITeamsProps } from "@/interfaces/teams";
import { addEllipsis } from "@/utils/stringManipulation";
import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  Line,
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface TeamDataChart {
  name: string;
  pontos: number;
  pv: number;
  amt: number;
}

const TeamsByPoints = ({ teams }: ITeamsProps) => {
  const [teamsData, setTeamsData] = useState<Array<TeamDataChart>>([]);

  useEffect(() => {
    teams.forEach((e) => {
      console.log(e.players.length, e.name);
      if (e.points > 0) {
        setTeamsData((prevTeamsData) => [
          ...prevTeamsData,
          { name: addEllipsis(e.name), pontos: e.points, pv: 1, amt: 2 },
        ]);
      }
    });
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Classificação Geral</CardTitle>
          <CardDescription>Time com mais pontos</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width={"100%"} height={300}>
            <LineChart
              data={teamsData}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <Line type="monotone" dataKey="pontos" stroke="#ef4444" />
              <CartesianGrid stroke="#e4e4e7" strokeDasharray="4 4" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default TeamsByPoints;
