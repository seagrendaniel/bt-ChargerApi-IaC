export interface Charger {
  id: number;
  name: string;
  description: string;
  status: "active" | "disabled" | "out of order";
  location: {
      latitude: number;
      longitude: number;
  };
  networkProtocol: string;
  publicVisibility: boolean;
}
