import { Badge, Box, Field, FieldLabel, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { TiTimes } from "react-icons/ti";

interface TagInputProps {
  title?: string;
  allowDuplicates?: boolean;
  placeholder?: string;
  disabled?: boolean;
  value?: string[];
  onChange: (value: string[]) => void;
  border?: string;
  bg?: string;
  size?: "sm" | "md" | "lg";
}

const AppTagInput: React.FC<TagInputProps> = ({
  title,
  allowDuplicates = false,
  placeholder,
  disabled = false,
  onChange,
  value,
  border = "1px solid",
  bg,
  size,
  ...inputProps
}) => {
  const [tags, setTags] = useState<string[]>(value ?? []);
  const [inputValue, setInputValue] = useState<string>("");

  const addTags = (value: string) => {
    const newTags = value
      .split(/,|\t/)
      .map(tag => tag.trim())
      .filter(tag => tag !== "");

    const uniqueTags = allowDuplicates ? newTags : newTags.filter(tag => !tags.includes(tag));
    if (uniqueTags.length > 0) {
      const updatedTags = [...tags, ...uniqueTags];
      setTags(updatedTags);
      onChange(updatedTags);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addTags(inputValue);
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      const updatedTags = tags.slice(0, -1);
      setTags(updatedTags);
      onChange(updatedTags);
    }
  };

  const handleBlur = () => {
    if (inputValue.trim() !== "") {
      addTags(inputValue);
      setInputValue("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    onChange(updatedTags);
  };

  return (
    <Field.Root disabled={disabled} data-test="taginput-root">
      {title && (
        <FieldLabel data-test="taginput-label">
          <Text as="b">{title}</Text>
        </FieldLabel>
      )}
      <Stack w="100%">
        <Box
          borderWidth="1px"
          borderRadius="md"
          display="flex"
          alignItems="center"
          flexWrap="wrap"
          border={border}
          bg={bg}
          data-test="taginput-box"
        >
          {tags.map(tag => (
            <Badge
              key={tag}
              display="flex"
              alignItems="center"
              borderRadius="full"
              data-test="taginput-tag"
              data-value={tag}
            >
              {tag}
              <TiTimes
                data-test="taginput-remove"
                style={{ marginLeft: "4px", cursor: "pointer" }}
                onClick={() => {
                  handleRemoveTag(tag);
                }}
              />
            </Badge>
          ))}
          <Input
            data-test="taginput-input"
            placeholder={placeholder ?? "Enter values separated by commas or tabs"}
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            flex="1"
            size={size}
            outline="none"
            _focus={{ boxShadow: "none" }}
            border="none"
            disabled={disabled}
            {...inputProps}
          />
        </Box>
      </Stack>
    </Field.Root>
  );
};

export default AppTagInput;
