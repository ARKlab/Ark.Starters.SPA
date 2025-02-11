import { Button, Input, HStack } from '@chakra-ui/react'
import { useState } from 'react'
import { TiTimes } from 'react-icons/ti'

import { InputGroup } from '../ui/input-group';

import type { InputHeaderWithClearProps } from "./chackraInputFilterWithClear";

export const ChackraInputHeaderFilterWithClear: React.FC<
  InputHeaderWithClearProps
> = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e)
  }

  const handleClear = () => {
    setInputValue('')
    const event = {
      target: {
        value: '',
      },
    } as React.ChangeEvent<HTMLInputElement>
    if (onChange) onChange(event)
  }

  return (
    <HStack width="full">
      <InputGroup
        flex="1"
        endElement={
          inputValue && (
            <Button size="xs" rounded="full" onClick={handleClear} aria-label="Clear input">
              <TiTimes />
            </Button>
          )
        }
      >
        <Input value={inputValue} onChange={handleChange} size="sm" placeholder="Type here..." />
      </InputGroup>
    </HStack>
  );
};
