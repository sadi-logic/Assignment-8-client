import { notFound } from "next/navigation";
import StudioDetailsPage from "@/app/studios/[id]/studio-details";
import { getStudioById } from "@/lib/studios";

export default async function StudioDetailsRoute({
  params,
}: PageProps<"/studios/[id]">) {
  const { id } = await params;
  const studio = await getStudioById(id);

  if (!studio) notFound();

  return <StudioDetailsPage studio={studio} />;
}
