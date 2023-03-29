import React, { useCallback, useEffect, useState } from "react";
import { Storage } from '@capacitor/storage';

import UserContext, {User} from "./user-context";

const UserContextProvider: React.FC = props => {
    const [user, setUser] = useState<User[]>([
        {
            uid: -1
        }
    ]);

    const initContext = useCallback(async() => {
        const userData = await Storage.get({key: 'pickment_user'});
        const storedUser = userData.value? JSON.parse(userData.value) : [];
        const loadedUser: User[] = [];

        for(const u of storedUser) {
            loadedUser.push({
                uid: u.uid
            });
        }

        setUser(loadedUser);
    }, []);

    const login = (uid: number) => {
        const thisUser: User = { uid: uid };

        setUser((currUser: User[]) => {
            return currUser.concat(thisUser);
        });
    };

    const logout = () => {
        setUser([]);
    };

    useEffect(() => {
        const storableUser = user.map(u => {
            return {
                uid: u.uid
            }
        });

        Storage.set({key: 'pickment_user', value: JSON.stringify(storableUser)});
    }, [user]);

    return (
        <UserContext.Provider value={{
            user,
            login,
            logout,
            initContext
        }}>
            {props.children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;