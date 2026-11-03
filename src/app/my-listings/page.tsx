import { RequireAuth } from "@/components/auth/require-auth";
import MyStudioListingPage from "@/app/dashboard/my-studio-listing/page";

export default function MyListingsPage() {
  return (
    <RequireAuth>
      <MyStudioListingPage />
    </RequireAuth>
  );
}
