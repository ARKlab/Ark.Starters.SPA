import { Flex, Spinner } from "@chakra-ui/react";


export default function CenterSpinner() {

    return (
        <Flex direction={'column'} align={'center'} justifyContent={'center'} gap={'1ch'} data-role={'spinner'} >
            <Spinner />
        </Flex>
    );
}
