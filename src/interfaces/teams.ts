export interface ITeamsProps {
  teams: ITeam[];
}

export interface ITeam {
  id: number;
  name: string;
  points: number;
  scored_goals: number;
  conceded_goals: number;
  created_at: string;
  updated_at: string;
  players: any[];
}
