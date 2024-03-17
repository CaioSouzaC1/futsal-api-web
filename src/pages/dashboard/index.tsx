import AppLayout from "@/_layouts/app";
import PlayersByTeam from "@/components/charts/players-by-time";
import TeamsByPoints from "@/components/charts/teams-by-points";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ITeamsProps } from "@/interfaces/teams";
import api from "@/services/api";
import { forceHeaders } from "@/utils/forceHeaders";
import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
} from "recharts";
const data = [
  { name: "Page A", uv: 400, pv: 2400, amt: 2400 },
  { name: "TIME B", uv: 300, pv: 2200, amt: 2800 },
  { name: "TIME C", uv: 900, pv: 2500, amt: 3000 },
  { name: "TIME D", uv: 100, pv: 1900, amt: 5202 },
];

const data02 = [
  {
    subject: "Math",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "Chinese",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "English",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "Geography",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "Physics",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "History",
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

const Dashboard = ({ teams }: ITeamsProps) => {
  return (
    <main>
      <AppLayout>
        <div className="w-full flex flex-wrap">
          <div className="px-4 pb-6 w-full lg:w-[70%]">
            <TeamsByPoints teams={teams} />
          </div>
          <div className="px-4 pb-6 w-full lg:w-[30%]">
            <PlayersByTeam teams={teams} />
          </div>
          {/* 
          <div className="px-4 pb-6 w-full lg:w-[35%]">
            <Card>
              <CardHeader>
                <CardTitle>Disciplinas favoritas</CardTitle>
                <CardDescription>Dos jogadores dos times</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data02}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis />
                    <Radar
                      name="Mike"
                      dataKey="A"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="px-4 pb-6 w-full lg:w-[65%]">
            <Card>
              <CardHeader>
                <CardTitle>Disciplinas favoritas</CardTitle>
                <CardDescription>Dos jogadores dos times</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart
                    width={500}
                    height={400}
                    data={data}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="uv"
                      stroke="#ef4444"
                      fill="#ef4444"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div> */}
        </div>
      </AppLayout>
    </main>
  );
};

export default Dashboard;

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const session = await getSession(context);

    const response = await api.get("/team", forceHeaders(session?.token));

    const teams = response.data.data;

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
        session,
        teams,
      },
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      props: {
        session: null,
      },
    };
  }
};
