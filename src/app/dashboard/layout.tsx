const layout = ({children}:{children: React.ReactNode}) => {
    return (
        <div className="flex gap-6">
            <div className="font-bold text-6xl w-[250px] bg-blue-400 h-screen">sidebar</div>
            <div className="flex-1 bg-purple-400">{children}</div>
        </div>
    );
};

export default layout;