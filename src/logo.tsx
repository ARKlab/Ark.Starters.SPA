import { Image } from '@chakra-ui/react'

import imgUrl from './logo.png'

export const Logo = () => {
    return <Image
        height={'12'}
        src={imgUrl}
        alt="ARK Logo"
        loading="eager"
    />
}