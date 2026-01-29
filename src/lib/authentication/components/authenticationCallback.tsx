import { useRef } from "react"

import { useAppDispatch, useAppSelector } from "../../../app/hooks"
import CenterSpinner from "../../../components/centerSpinner"
import { ErrorDisplay } from "../../../components/errorDisplay"
import useAsyncEffect from "../../useAsyncEffect"
import { HandleRedirect, authSelector } from "../authenticationSlice"

export const AuthenticationCallback = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(authSelector)

  const ref = useRef<boolean>(false)

  useAsyncEffect(async () => {
    if (ref.current) return
    ref.current = true
    await dispatch(HandleRedirect())
  }, [dispatch])

  if (auth.isError) return ErrorDisplay({ ...auth.error })

  if (auth.isLoading) return <CenterSpinner />

  return <></>
}
