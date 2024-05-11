import { Image } from '@chakra-ui/react'

import imgUrl from './logo-ark.png'

export const Logo = () => {
    return <Image
        height={'50px'}
        src={imgUrl}
        alt=""
    />
}