import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { LuFile, LuX, LuUpload } from "react-icons/lu";

interface FileUploadProps {
  onFileSelect?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export default function AppFileUpload({
  onFileSelect,
  accept,
  multiple = false,
  maxSize = 10 * 1024 * 1024,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFiles = (files: File[]): boolean => {
    for (const file of files) {
      if (file.size > maxSize) {
        setError(
          `Il file ${file.name} supera la dimensione massima di ${(maxSize / 1024 / 1024).toFixed(1)}MB`,
        );
        return false;
      }
    }
    setError(null);
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    if (!validateFiles(fileArray)) return;
    setSelectedFiles(fileArray);
    onFileSelect?.(fileArray);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };
  const handleClick = () => fileInputRef.current?.click();
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    onFileSelect?.(newFiles);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <VStack gap={"4"} width="full" alignItems="stretch" data-test="fileupload-root">
      <Box
        data-test="fileupload-dropzone"
        position="relative"
        width="full"
        minHeight="3xs"
        border="xs"
        borderColor={isDragging ? "brand.border" : error ? "error.fg" : "border"}
        borderRadius="xl"
        bg={isDragging ? "brand.subtle" : "bg"}
        cursor="checkbox"
        transition="all"
        transitionDuration="fast"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <VStack
          position="absolute"
          top="1/2"
          left="1/2"
          transform="translate(-50%, -50%)"
          gap={"3"}
          pointerEvents="none"
          data-test="fileupload-center"
        >
          <Box
            p={"4"}
            borderRadius="full"
            bg={isDragging ? "brand.solid" : "brand.muted"}
            color={isDragging ? "brand.contrast" : "brand.fg"}
            transition="all"
            transitionDuration="fast"
            data-test="fileupload-icon-wrapper"
          >
            <Icon size={"md"} data-test="fileupload-upload-icon">
              <LuUpload />
            </Icon>
          </Box>
          <VStack gap={"1"}>
            <Text fontSize="lg" fontWeight="semibold" color="fg" data-test="fileupload-main-text">
              {isDragging ? "Rilascia i file qui" : "Trascina i file qui"}
            </Text>
            <Text fontSize="sm" color="fg.muted" data-test="fileupload-secondary-text">
              oppure clicca per selezionare
            </Text>
          </VStack>
          {accept && (
            <Text fontSize="xs" color="fg.muted" data-test="fileupload-accept">
              Formati supportati: {accept}
            </Text>
          )}
        </VStack>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          data-test="fileupload-input"
        />
      </Box>

      {error && (
        <Box
          p="3"
          bg="red.100"
          borderRadius="md"
          borderLeft="xs"
          borderLeftColor="error.solid"
          data-test="fileupload-error"
        >
          <Text fontSize="sm" color="error.fg">
            {error}
          </Text>
        </Box>
      )}

      {selectedFiles.length > 0 && (
        <VStack gap="2" alignItems="stretch" data-test="fileupload-list">
          <Text fontSize="sm" fontWeight="semibold" color="fg" data-test="fileupload-count">
            File selezionati ({selectedFiles.length})
          </Text>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={"3"}
              bg="bg"
              borderRadius="lg"
              border="xs"
              borderColor="border"
              data-test="fileupload-item"
              data-name={file.name}
            >
              <Box display="flex" alignItems="center" gap={"3"} flex={"1"} minWidth={"0"}>
                <Box
                  p={"2"}
                  borderRadius="md"
                  bg="brand.muted"
                  color="brand.fg"
                  flexShrink={0}
                >
                  <Icon size={"md"} data-test="fileupload-file-icon">
                    <LuFile />
                  </Icon>
                </Box>
                <Box flex={"1"} minWidth={"0"}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="fg"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    data-test="fileupload-item-name"
                  >
                    {file.name}
                  </Text>
                  <Text fontSize="xs" color="fg.muted" data-test="fileupload-item-size">
                    {formatFileSize(file.size)}
                  </Text>
                </Box>
              </Box>
              <Box
                as="button"
                p={"1"}
                borderRadius="md"
                color="fg.muted"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                data-test="fileupload-remove"
              >
                <Icon size={"md"}>
                  <LuX />
                </Icon>
              </Box>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
