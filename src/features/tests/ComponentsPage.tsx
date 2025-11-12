import { Box, Button, Heading, Text } from "@chakra-ui/react";
import { formatDate } from "date-fns";
import { useState } from "react";

import { AppCheckBox } from "../../lib/components/AppCheckBox/appCheckBox";
import { AppCopyToClipBoard } from "../../lib/components/AppCopyToClipBoard/appCopyToClipBoard";
import { AppDatePicker } from "../../lib/components/AppDatePicker/appDatePicker";
import AppFileUpload from "../../lib/components/AppFileUpload/appFileUpload";
import { AppInput } from "../../lib/components/AppInput/appInput";
import { AppModal } from "../../lib/components/AppModal/appModal";
import type { Item as MultiItem } from "../../lib/components/AppMultiSelect/appMultiSelect";
import AppMultiSelect from "../../lib/components/AppMultiSelect/appMultiSelect";
import { AppNumberInput } from "../../lib/components/AppNumberInput/AppNumberInput";
import AppPagination from "../../lib/components/AppPagination/AppPagination";
import type { AppSelectOptionItem } from "../../lib/components/AppSelect/appSelect";
import AppSelect from "../../lib/components/AppSelect/appSelect";
import AppTagInput from "../../lib/components/AppTagInput/AppTagInput";

export default function ComponentsTestPage() {
  // Pagination states
  const [largePage, setLargePage] = useState(1);
  const [largePageSize, setLargePageSize] = useState(10);
  const [smallPage] = useState(1);
  const [smallPageSize] = useState(10);
  // DatePicker states
  const [singleDate, setSingleDate] = useState<Date | undefined>(undefined);
  const [boundedDate, setBoundedDate] = useState<Date | undefined>(undefined);
  const minBound = new Date(2025, 0, 10); // 10 Jan 2025
  const maxBound = new Date(2025, 0, 15); // 15 Jan 2025
  // AppInput state
  const [inputValue, setInputValue] = useState<string>("");
  // AppModal states
  const [modalOpen, setModalOpen] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  //AppSelect states
  const [selectValue, setSelectValue] = useState<string | undefined>();
  const [disabledSelectValue, setDisabledSelectValue] = useState<string | undefined>("b");
  const [loadingSelect] = useState(false);
  const selectOptions: AppSelectOptionItem[] = [
    { label: "Alpha", value: "a" },
    { label: "Bravo", value: "b" },
    { label: "Charlie", value: "c", disabled: true },
    { label: "Delta", value: "d" },
  ];
  //AppMultiSelect states
  const multiOptions: MultiItem[] = [
    { label: "Alpha", value: "a" },
    { label: "Bravo", value: "b" },
    { label: "Charlie", value: "c" },
    { label: "Delta", value: "d" },
  ];
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [multiLoadingValue, setMultiLoadingValue] = useState<string[]>([]);
  //App Number Input states
  const [numberValue, setNumberValue] = useState<number | undefined>(undefined);
  const [invalidNumberValue, setInvalidNumberValue] = useState<number | undefined>(5);
  // App Tag Input states
  const [tagsBasic, setTagsBasic] = useState<string[]>([]);
  const [tagsNoDup, setTagsNoDup] = useState<string[]>([]);
  const [tagsWithDup, setTagsWithDup] = useState<string[]>([]);
  const [tagsDisabled] = useState<string[]>(["fixed"]);
  // FileUpload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedMultipleFiles, setSelectedMultipleFiles] = useState<File[]>([]);
  // AppCheckBox states
  const [checkboxBasic, setCheckboxBasic] = useState(false);
  const [checkboxWithTitle, setCheckboxWithTitle] = useState(true);
  const [checkboxDisabled] = useState(false);
  const [checkboxInvalid, setCheckboxInvalid] = useState(false);
  return (
    <Box as="main" p="4">
      <Heading size="md" mb="4">
        Components Test Page - used by automated tests
      </Heading>
      <Box mt={"10"} data-test="appselect-section">
        <Text fontWeight="bold" mb={"2"}>
          AppSelect Variants
        </Text>

        <Box data-test="appselect-basic" mb={"4"}>
          <AppSelect
            title="Basic Select"
            options={selectOptions}
            value={selectValue}
            onChange={setSelectValue}
            placeholder="Pick one"
          />
          <Text mt={"1"} fontSize="sm" data-test="appselect-basic-value">
            Value: {selectValue ?? "(none)"}
          </Text>
        </Box>

        <Box data-test="appselect-disabled" mb={"4"}>
          <AppSelect
            title="Disabled Select"
            options={selectOptions}
            value={disabledSelectValue}
            onChange={setDisabledSelectValue}
            disabled
          />
        </Box>

        <Box data-test="appselect-loading" mb={"4"}>
          <AppSelect
            title="Loading Select"
            options={selectOptions}
            value={undefined}
            onChange={() => {
              /* empty */
            }}
            isLoading={loadingSelect || true}
          />
        </Box>

        <Box data-test="appselect-invalid" mb={"4"}>
          <AppSelect
            title="Invalid Select"
            options={selectOptions}
            value={selectValue}
            onChange={setSelectValue}
            invalid
            fieldErrorText="Selection required"
            placeholder="Choose..."
          />
        </Box>
      </Box>
      <Box data-test="pagination-large" mb="6">
        <Text fontWeight="bold">Pagination Grande (count=120)</Text>
        <AppPagination
          count={120}
          page={largePage}
          pageSize={largePageSize}
          isLoading={false}
          onPageChange={setLargePage}
          onPageSizeChange={setLargePageSize}
        />
        <Text mt="2" data-test="pagination-large-current">
          Pagina corrente: {largePage}
        </Text>
      </Box>

      <Box data-test="pagination-small" mb="6">
        <Text fontWeight="bold">Pagination Piccola (count=5)</Text>
        <AppPagination
          count={5}
          page={smallPage}
          pageSize={smallPageSize}
          isLoading={false}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onPageChange={() => {}}
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          onPageSizeChange={() => {}}
        />
        <Text mt="2" data-test="pagination-small-current">
          Pagina corrente: {smallPage}
        </Text>
      </Box>

      <Box data-test="datepicker-basic">
        <Text fontWeight="bold">Single Date (Basic)</Text>
        <AppDatePicker
          label="Basic"
          date={singleDate ?? null}
          setDate={d => {
            setSingleDate(d);
          }}
        />
        <Text data-test="datepicker-basic-value">{singleDate ? formatDate(singleDate, "dd/MM/yyyy") : ""}</Text>
      </Box>

      <Box data-test="datepicker-bounded">
        <Text fontWeight="bold">Bounded Date (10-15 Jan 2025)</Text>
        <AppDatePicker
          label="Bounded"
          date={boundedDate ?? null}
          setDate={d => {
            setBoundedDate(d);
          }}
          minDate={minBound}
          maxDate={maxBound}
        />
        <Text data-test="datepicker-bounded-value">{boundedDate ? formatDate(boundedDate, "dd/MM/yyyy") : ""}</Text>
      </Box>

      <Box data-test="appinput-section">
        <Box data-test="first-input">
          <AppInput title="Test Input" value={inputValue} onChange={setInputValue} />
        </Box>
        <Box data-test="disabled-input">
          <AppInput
            title="Disabled Input"
            value={"cannot edit"}
            onChange={() => {
              /* empty */
            }}
            disabled
          />
        </Box>
        <Box data-test="invalid-input">
          <AppInput
            title="Invalid Input"
            value={inputValue}
            onChange={setInputValue}
            invalid
            fieldErrorText="Error message"
          />
        </Box>
      </Box>
      <Box mt={"10"} data-test="appmodal-section">
        <Button
          data-test="open-appmodal-btn"
          onClick={() => {
            setModalOpen(true);
          }}
          mb={"2"}
        >
          Open Modal
        </Button>
        <Box fontSize="sm" data-test="appmodal-submit-count">
          Submits: {submitCount}
        </Box>
        <AppModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
          }}
          onSubmit={() => {
            setSubmitCount(c => c + 1);
          }}
          submitButton
          footerCloseButton
          submitButtonText="Save"
          size="md"
          title="Test Modal"
          body={<Box p={"2"}>Modal body content</Box>}
        />
      </Box>
      <Box mt={"10"} data-test="appmultiselect-section">
        <Box mb={"6"} data-test="appmultiselect-basic">
          <AppMultiSelect
            title="Multi Select"
            options={multiOptions}
            value={multiValue}
            onChange={setMultiValue}
            placeholder="Pick many"
          />
          <Text mt={"1"} fontSize="sm" data-test="appmultiselect-basic-value">
            Values: {multiValue.length ? multiValue.join(",") : "(none)"}
          </Text>
        </Box>
        <Box mb={"6"} data-test="appmultiselect-loading">
          <AppMultiSelect
            title="Multi Select Loading"
            options={multiOptions}
            value={multiLoadingValue}
            onChange={setMultiLoadingValue}
            isLoading
            placeholder="Loading..."
          />
        </Box>
        <Box mb={"6"} data-test="appmultiselect-empty">
          <AppMultiSelect
            title="Empty Options"
            options={[]}
            value={[]}
            onChange={() => {
              /* empty */
            }}
            placeholder="No options"
          />
        </Box>
      </Box>
      <Box data-test="appnumberinput-section" mt={"8"}>
        <Box data-test="first-number-input">
          <AppNumberInput title="Number Input" value={numberValue} setValue={setNumberValue} />
        </Box>
        <Box data-test="invalid-number-input">
          <AppNumberInput
            title="Invalid Number Input"
            value={invalidNumberValue}
            setValue={setInvalidNumberValue}
            invalid
            fieldErrorText="Invalid number"
          />
        </Box>
        <Box data-test="preset-number-input">
          <AppNumberInput
            title="Preset Number Input"
            value={10}
            setValue={() => {
              /* empty */
            }}
          />
        </Box>
      </Box>
      <Box mt={"8"} data-test="copyclip-section">
        <Box mb={"4"} data-test="copyclip-button">
          <AppCopyToClipBoard value="Alpha123" />
        </Box>
        <Box mb={"4"} data-test="copyclip-icon">
          <AppCopyToClipBoard value="Beta456" useIcon />
        </Box>
      </Box>
      <Box mt={"8"} data-test="taginput-section">
        <Box mb={"6"} data-test="taginput-basic">
          <AppTagInput title="Tag Input Basic" onChange={setTagsBasic} value={tagsBasic} />
          <Text fontSize="sm" data-test="taginput-basic-value">
            Values: {tagsBasic.join(",") || "(none)"}
          </Text>
        </Box>
        <Box mb={"6"} data-test="taginput-nodup">
          <AppTagInput title="Tag Input No Dup" onChange={setTagsNoDup} value={tagsNoDup} allowDuplicates={false} />
          <Text fontSize="sm" data-test="taginput-nodup-value">
            Values: {tagsNoDup.join(",") || "(none)"}
          </Text>
        </Box>
        <Box mb={"6"} data-test="taginput-dup">
          <AppTagInput title="Tag Input Dup" onChange={setTagsWithDup} value={tagsWithDup} allowDuplicates />
          <Text fontSize="sm" data-test="taginput-dup-value">
            Values: {tagsWithDup.join(",") || "(none)"}
          </Text>
        </Box>
        <Box mb={"6"} data-test="taginput-disabled">
          <AppTagInput
            title="Tag Input Disabled"
            onChange={() => {
              /* empty */
            }}
            value={tagsDisabled}
            disabled
          />
        </Box>
      </Box>
      <Box mt={"8"} data-test="fileupload-section">
        <Text fontWeight="bold" mb={"4"}>
          FileUpload Variants
        </Text>

        <Box mb={"6"} data-test="fileupload-single">
          <Text mb={"2"}>Single File Upload</Text>
          <AppFileUpload onFileSelect={setSelectedFiles} accept=".txt,.pdf,.doc" multiple={false} />
          <Text mt={"2"} fontSize="sm" data-test="fileupload-single-count">
            Selected: {selectedFiles.length} file(s)
          </Text>
        </Box>

        <Box mb={"6"} data-test="fileupload-multiple">
          <Text mb={"2"}>Multiple File Upload</Text>
          <AppFileUpload
            onFileSelect={setSelectedMultipleFiles}
            accept="image/*"
            multiple={true}
            maxSize={5 * 1024 * 1024} // 5MB
          />
          <Text mt={"2"} fontSize="sm" data-test="fileupload-multiple-count">
            Selected: {selectedMultipleFiles.length} file(s)
          </Text>
        </Box>

        <Box mb={"6"} data-test="fileupload-no-accept">
          <Text mb={"2"}>No Accept Restrictions</Text>
          <AppFileUpload
            onFileSelect={() => {
              /* empty */
            }}
            multiple={false}
          />
        </Box>
      </Box>
      <Box mt={"8"} data-test="checkbox-section">
        <Text fontWeight="bold" mb={"4"}>
          Checkbox Variants
        </Text>

        <Box mb={"4"} data-test="checkbox-basic">
          <AppCheckBox
            checked={checkboxBasic}
            setChecked={setCheckboxBasic}
            label="Basic Checkbox"
            data-test="checkbox-basic"
          />
        </Box>

        <Box mb={"4"} data-test="checkbox-with-title">
          <AppCheckBox
            checked={checkboxWithTitle}
            setChecked={setCheckboxWithTitle}
            title="Checkbox Title"
            label="With Title Label"
          />
        </Box>

        <Box mb={"4"} data-test="checkbox-disabled">
          <AppCheckBox
            checked={checkboxDisabled}
            setChecked={() => {
              /* empty */
            }}
            label="Disabled Checkbox"
            disabled
          />
        </Box>

        <Box mb={"4"} data-test="checkbox-invalid">
          <AppCheckBox
            checked={checkboxInvalid}
            setChecked={setCheckboxInvalid}
            title="Invalid Checkbox"
            label="Required field"
            invalid
            fieldErrorText="This field is required"
          />
        </Box>
      </Box>
    </Box>
  );
}
