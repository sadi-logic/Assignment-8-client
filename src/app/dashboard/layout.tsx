import Sidebar from "./_components/Sidebar";
import { RequireAuth } from "@/components/auth/require-auth";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <RequireAuth>
      <div className="flex gap-6">
        <Sidebar />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </RequireAuth>
  );
};

export default layout;
