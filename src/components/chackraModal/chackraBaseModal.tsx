import {
  Button,
  DialogRoot,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogBackdrop,
} from '@chakra-ui/react'
import type { JSX } from "react"

export const ChackraUIBaseModal = (props: {
  isOpen: boolean
  onClose?: () => void
  onSubmit?: () => void
  submitButton?: boolean
  footerCloseButton?: boolean
  submitButtonText?: string
  title: string
  body: JSX.Element
  blurredOverlay?: boolean
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}) => {
  const executeSubmit = () => {
    if (props.onSubmit) props.onSubmit()
    if (props.onClose) props.onClose()
  }
  let submitSegment = <></>
  let footerCloseButton = <></>
  if (props.submitButton)
    submitSegment = (
      <Button colorScheme="brandPalette" mr={3} onClick={() => { executeSubmit(); }}>
        {props.submitButtonText}
      </Button>
    )
  if (props.footerCloseButton) {
    footerCloseButton = (
      <Button colorScheme="red" mr={3} onClick={props.onClose}>
        Close
      </Button>
    )
  }
  if (!props.onClose) props.onClose = () => { /* do nothing */ }
  let overlay = <DialogBackdrop />;
  if (props.blurredOverlay)
    overlay = <DialogBackdrop bg="blackAlpha.300" backdropFilter="blur(5px)" />;
  return (
    <>
      <DialogRoot open={props.isOpen} onOpenChange={props.onClose} size={props.size}>
        {overlay}
        <DialogContent>
          <DialogHeader>{props.title}</DialogHeader>
          <DialogCloseTrigger />
          <DialogBody>{props.body}</DialogBody>
          <DialogFooter>
            {submitSegment}
            {footerCloseButton}
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  )
}
