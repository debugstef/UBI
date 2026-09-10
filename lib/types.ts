export type UbiEvent = {
  id: string;
  title: string;
  type: string;
  district: string;
  distance: string;
  description: string;
  latitude: number;
  longitude: number;
  activity: 'bajo' | 'activo' | 'lleno' | 'trending';
  people: number;
  music: string[];
  price: number;
  age: string;
  friends: number;
  lastStory: number;
  voyCommits: number;
  isLiveNow: boolean;
};
export type UbiStore = {
  id: string;
  name: string;
  district: string;
  distance: string;
  latitude: number;
  longitude: number;
  tags: string[];
};
