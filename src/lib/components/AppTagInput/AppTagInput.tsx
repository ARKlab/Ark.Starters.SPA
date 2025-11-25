import { Field, FieldLabel, TagsInput, Text } from "@chakra-ui/react";

interface TagInputProps {
  title?: string;
  disabled?: boolean;
  value?: string[];
  onChange: (value: string[]) => void;
  border?: string;
  bg?: string;
  size?: "sm" | "md" | "lg";
}

const AppTagInput: React.FC<TagInputProps> = ({ title, disabled = false, onChange, value }) => {
  return (
    <Field.Root disabled={disabled} data-test="taginput-root">
      {title && (
        <FieldLabel data-test="taginput-label">
          <Text as="b">{title}</Text>
        </FieldLabel>
      )}
      <TagsInput.Root
        value={value ?? []}
        onValueChange={details => {
          onChange(details.value);
        }}
      >
        <TagsInput.Label>Tags</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input data-test="taginput-input" placeholder="Add tag..." />
        </TagsInput.Control>
      </TagsInput.Root>
    </Field.Root>
  );
};

export default AppTagInput;
