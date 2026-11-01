import React from 'react';

const dashBoard = () => {
    return (
        <div className="flex items-center justify-center h-screen text-2xl font-bold">
            <div className="mb-20 mr-5">
                <h2 className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">Dashboard</h2>
                 <p className="text-lg text-muted-foreground">
                Welcome to your dashboard!<br/>
                 
            </p>
            </div>         
           <h2 className="text-2xl font-bold"><span className="bg-gradient-to-r from-blue-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">Navigate</span> to your desired section</h2>
        </div>
    );
};

export default dashBoard;