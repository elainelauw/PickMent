import React from "react";

export interface User {
    uid: number
}

interface Context {
    user: User[];
    login: (
        uid: number
    ) => void;
    logout: () => void;
    initContext: () => void;
}

const UserContext = React.createContext<Context>({
    user: [],
    login: () => {},
    logout: () => {},
    initContext: () => {}
});

export default UserContext;