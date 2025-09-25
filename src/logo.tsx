import { Image } from '@chakra-ui/react'

import imgUrl from './logo.png'

export const Logo = () => {
    return <Image
        height={'50px'}
        src={imgUrl}
        alt=""
    />
}