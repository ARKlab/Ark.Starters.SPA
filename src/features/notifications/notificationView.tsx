import { useToast } from '@chakra-ui/react'
import { useEffect } from 'react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'

import { resetNotification, selectNotification } from './notification'

const NotificationView = () => {
  const toast = useToast()

  const dispatch = useAppDispatch()
  const notification = useAppSelector(selectNotification)

  useEffect(() => {
    if (notification) {
      toast({
        title: notification.title,
        description: notification.message,
        status: notification.status,
        duration: notification.duration,
        isClosable: notification.isClosable,
        position: notification.position,
      })
      dispatch(resetNotification())
    }
  }, [notification, toast, dispatch])

  return <> </>
}

export default NotificationView
