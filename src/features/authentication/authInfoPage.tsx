import { Box, Code } from "@chakra-ui/react";
import { useAppSelector } from "../../app/hooks";
import { authSelector } from "../../lib/authentication/authenticationSlice";


const AuthInfoPage = () => {

    const auth = useAppSelector(authSelector);


    return (
        <Box>
            <Code
                display="block"
                whiteSpace="pre"
                overflow="auto"
            >
                {JSON.stringify(auth, null, 2)}
            </Code>
        </Box>
    );
};

export default AuthInfoPage;
