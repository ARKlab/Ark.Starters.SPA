import { Button, InputGroup, InputRightElement } from '@chakra-ui/react'
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import { useState } from 'react'
import { TiTimes } from 'react-icons/ti'

export const ChackraDateRangeInHeader = (props: {
  dateFormat?: string
  onChange: (e: string[]) => void
  isLoading: boolean
}) => {
  const { dateFormat, onChange, isLoading } = props

  const [value, setValue] = useState<Date[]>([])
  const handleOnChange = (e: Date[]) => {
    const isoDates = e.map((date) => date.toISOString())
    setValue(e)
    onChange(isoDates)
  }

  return (
    <InputGroup zIndex={'dropdown'}>
      <RangeDatepicker
        configs={{
          dateFormat: dateFormat ? dateFormat : 'dd-MM-yyyy',
        }}
        selectedDates={value}
        onDateChange={(e) => handleOnChange(e)}
        disabled={isLoading}
      />
      {value.length > 0 && (
        <InputRightElement width="4.5rem" right="-11px">
          <Button
            rounded={'full'}
            size="xs"
            onClick={() => handleOnChange([] as Date[])}
          >
            <TiTimes />
          </Button>
        </InputRightElement>
      )}
    </InputGroup>
  )
}
