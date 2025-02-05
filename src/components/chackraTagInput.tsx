import { Badge, FormControl, FormLabel, HStack, Input, InputGroup, Text } from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

interface TagInputProps {
  handleInputChange: (name: string, value: string[]) => void;
  title: string;
  propName: string;
  allowDuplicates?: boolean;
}

const ChackraTagInput: React.FC<TagInputProps> = ({ handleInputChange, title, propName, allowDuplicates = false }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.includes(",")) {
      const newTags = value
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      const uniqueTags = allowDuplicates ? newTags : newTags.filter(tag => !tags.includes(tag));
      setTags([...tags, ...uniqueTags]);
      setInputValue("");
      handleInputChange(propName, [...tags, ...uniqueTags]);
    } else {
      setInputValue(value);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    handleInputChange(propName, updatedTags);
  };

  return (
    <FormControl mr="2%">
      <FormLabel>
        <Text as="b">{title}</Text>
      </FormLabel>
      <InputGroup>
        <Input placeholder="Enter values separated by commas" value={inputValue} onChange={handleChange} />
      </InputGroup>
      <HStack wrap="wrap" mt={2}>
        {tags.map(tag => (
          <Badge
            key={tag}
            colorScheme="blue"
            mr={2}
            mb={2}
            cursor="pointer"
            display="flex"
            alignItems="center"
            borderRadius="full"
          >
            {tag}
            <TiTimes
              style={{ marginLeft: "4px", cursor: "pointer" }}
              onClick={() => {
                handleRemoveTag(tag);
              }}
            />
          </Badge>
        ))}
      </HStack>
    </FormControl>
  );
};

export default ChackraTagInput;
