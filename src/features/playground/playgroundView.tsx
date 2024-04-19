import { Box, Button, Heading, Wrap, WrapItem } from '@chakra-ui/react'
import React from 'react'

import { useAppDispatch } from '../../app/hooks'
import { dispatchNotification } from '../notifications/notification'
import type { NotificationPosition } from '../notifications/notificationsTypes'
import { NotificationDuration } from '../notifications/notificationsTypes'

const PlaygroundView = () => {
  const dispatch = useAppDispatch()
  const sendNotification = (
    id: string,
    message: string,
    duration: NotificationDuration,
    position: NotificationPosition,
  ) => {
    dispatch(
      dispatchNotification({
        id: id,
        title: 'Test Notification',
        message: message,
        status: 'success',
        duration: duration,
        isClosable: true,
        position: position,
      }),
    )
  }

  return (
    <Box>
      <Heading>PlayGround</Heading>
      <Box>
        <Heading size="md" my={'20px'}>
          Notifications
        </Heading>
        <Wrap spacing={1} my={'20px'}>
          <WrapItem>
            <Button
              onClick={() =>
                sendNotification(
                  '1',
                  "Here's your notification!",
                  NotificationDuration.VeryShort,
                  'top',
                )
              }
            >
              Top Very Short Norification{' '}
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() =>
                sendNotification(
                  '2',
                  "Here's your notification!",
                  NotificationDuration.Short,
                  'top-left',
                )
              }
            >
              Top Left Short Notification
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() =>
                sendNotification(
                  '3',
                  "Here's your notification!",
                  NotificationDuration.Medium,
                  'top-right',
                )
              }
            >
              Top Right Medium Notification
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() =>
                sendNotification(
                  '4',
                  "Here's your notification!",
                  NotificationDuration.Long,
                  'bottom-left',
                )
              }
            >
              Bottom Left Long Notification
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() =>
                sendNotification(
                  '5',
                  "Here's your notification!",
                  NotificationDuration.VeryLong,
                  'bottom-right',
                )
              }
            >
              Bottom Right Very Long Notification
            </Button>
          </WrapItem>
          <WrapItem>
            <Button
              onClick={() =>
                sendNotification(
                  '6',
                  "Here's your notification!",
                  NotificationDuration.VeryLong,
                  'bottom',
                )
              }
            >
              Bottom Very Long Notification
            </Button>
          </WrapItem>
        </Wrap>
      </Box>
    </Box>
  )
}

export default PlaygroundView
