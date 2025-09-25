import { Badge, Box, Field, FieldLabel, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

interface TagInputProps {
  handleInputChange: (name: string, value: string[]) => void;
  title: string;
  propName: string;
  allowDuplicates?: boolean;
  placeholder?: string;
}

const ChackraTagInput: React.FC<TagInputProps> = ({
  handleInputChange,
  title,
  propName,
  allowDuplicates = false,
  placeholder,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      const newTags = inputValue
        .split(/,|\t/)
        .map(tag => tag.trim())
        .filter(tag => tag !== "");

      const uniqueTags = allowDuplicates ? newTags : newTags.filter(tag => !tags.includes(tag));
      setTags([...tags, ...uniqueTags]);
      setInputValue("");
      handleInputChange(propName, [...tags, ...uniqueTags]);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      const updatedTags = tags.slice(0, -1);
      setTags(updatedTags);
      handleInputChange(propName, updatedTags);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    handleInputChange(propName, updatedTags);
  };

  return (
    <Field.Root>
      <FieldLabel>
        <Text as="b">{title}</Text>
      </FieldLabel>
      <Stack>
        <Box borderWidth="1px" borderRadius="md" padding="2" display="flex" alignItems="center" flexWrap="wrap">
          {tags.map(tag => (
            <Badge
              key={tag}
              colorPalette="primary"
              display="flex"
              alignItems="center"
              borderRadius="full"
              px={2}
              py={1}
              mr={1}
              mb={1}
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
          <Input
            placeholder={placeholder ?? "Enter values separated by commas or tabs"}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            flex="1"
            border="none"
            outline="none"
            _focus={{ boxShadow: "none" }}
          />
        </Box>
      </Stack>
    </Field.Root>
  );
};

export default ChackraTagInput;
