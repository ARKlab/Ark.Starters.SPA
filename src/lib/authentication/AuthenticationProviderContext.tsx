import React from "react";
import { AuthProvider } from "./authProviderInterface";
import { AuthenticationContext } from "./authenticationContext";

type AuthContextChildrens = {
    children: React.ReactNode;
    authProvider: AuthProvider;
};

export default function AuthenticationProviderContext({
    children, authProvider: instance,
}: AuthContextChildrens) {
    return (
        <AuthenticationContext.Provider value={instance}>
            {children}
        </AuthenticationContext.Provider>
    );
}
