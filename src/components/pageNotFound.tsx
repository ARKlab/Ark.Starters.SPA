import { Box, Center, Heading } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const PageNotFound = () => {
  const { t } = useTranslation('template');
  return (
    <Box>
      <Center>
        <Heading as="h2" size="xl">
          {t('errors.notFoundPage')}
        </Heading>
      </Center>
    </Box>
  )
}

export default PageNotFound
