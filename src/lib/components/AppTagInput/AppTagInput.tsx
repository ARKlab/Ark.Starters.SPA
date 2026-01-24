import { Field, FieldLabel, TagsInput, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
        <TagsInput.Label>{t("libComponents:appTagInput_tags")}</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input
            data-test="taginput-input"
            placeholder={t("libComponents:appTagInput_addTag")}
          />
        </TagsInput.Control>
      </TagsInput.Root>
    </Field.Root>
  );
};

export default AppTagInput;
