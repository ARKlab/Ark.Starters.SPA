import { useContext } from "react";
import { AuthenticationContext } from "./authenticationContext";


export function useAuthContext() {
    const context = useContext(AuthenticationContext);
    if (!context) {
        throw new Error(
            "useAuthContext must be used within a AuthenticationProvider"
        );
    }
    return { context: context, isLogged: context.getLoginStatus() === "Logged" };
}
