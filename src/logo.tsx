import { Image } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

import imgUrl from './logo.png'

export const Logo = () => {
    const { t } = useTranslation()
    return <Image
        height={'50px'}
        src={imgUrl}
        alt={t('groupsManagement_arkLogo')}
    />
}