import React, { createContext, useContext, useState } from 'react';


type FlatDetails = {
    FlatName: string;
    FlatId: string;
    buildingName: string;
    buildingId: string;
}

type SessionContextType = {
    flatDetails: FlatDetails | null;
    setFlatDetails: (details: FlatDetails) => void;
};

const SessionContext = createContext<SessionContextType>({
    flatDetails: null,
    setFlatDetails: () => { },
});

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [flatDetails, setFlatDetails] = useState<FlatDetails | null>(null);

    return (
        <SessionContext.Provider value={{ flatDetails, setFlatDetails }}>
            {children}
        </SessionContext.Provider>
    );
};

// Custom hook for easy access
export const useSession = () => useContext(SessionContext);