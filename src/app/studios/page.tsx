import StudioExplorer from "./studio-explorer";
import { getStudios } from "@/lib/studios";

export default async function ExploreStudiosPage() {
  const studios = await getStudios();

  return <StudioExplorer studios={studios} />;
}
