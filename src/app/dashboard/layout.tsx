import Sidebar from "./_components/Sidebar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex gap-6">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
};

export default layout;
