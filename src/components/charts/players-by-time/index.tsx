import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ITeamsProps } from "@/interfaces/teams";
import { useEffect, useState } from "react";
import { ResponsiveContainer, Pie, PieChart, Tooltip } from "recharts";

const data01 = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
  { name: "Group E", value: 278 },
  { name: "Group F", value: 189 },
];

interface TeamDataChart {
  name: string;
  value: number;
}

const PlayersByTeam = ({ teams }: ITeamsProps) => {
  const [teamsData, setTeamsData] = useState<Array<TeamDataChart>>([]);

  useEffect(() => {
    teams.forEach((e) => {
      console.log(e.players.length, e.name);
      if (e.players.length > 0) {
        setTeamsData((prevTeamsData) => [
          ...prevTeamsData,
          { name: e.name, value: e.players.length },
        ]);
      }
    });
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Jogadores por time</CardTitle>
          <CardDescription>Times com mais jogadores</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={teamsData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#ef4444"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
};

export default PlayersByTeam;
