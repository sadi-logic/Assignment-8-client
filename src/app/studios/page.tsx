import StudioExplorer from "./studio-explorer";
import { getStudios } from "@/lib/studios";

export default async function ExploreStudiosPage({
  searchParams,
}: PageProps<"/studios">) {
  const { category } = await searchParams;
  const studios = await getStudios();

  return (
    <StudioExplorer
      studios={studios}
      initialCategory={typeof category === "string" ? category : undefined}
    />
  );
}
