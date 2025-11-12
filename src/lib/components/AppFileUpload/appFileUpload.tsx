import { Box, Icon, Text, VStack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { FaFile, FaTimes, FaUpload } from "react-icons/fa";

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
        setError(`Il file ${file.name} supera la dimensione massima di ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
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
    <VStack gap={4} width="100%" alignItems="stretch" data-test="fileupload-root">
      <Box
        data-test="fileupload-dropzone"
        position="relative"
        width="100%"
        minHeight="200px"
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={isDragging ? "primary" : error ? "danger" : "border"}
        borderRadius="xl"
        bg={isDragging ? "brand.subtle" : "bg"}
        cursor="pointer"
        transition="all 0.2s"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <VStack
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          gap={"3"}
          pointerEvents="none"
          data-test="fileupload-center"
        >
          <Box
            p={4}
            borderRadius="full"
            bg={isDragging ? "primary" : "brand.muted"}
            color={isDragging ? "white" : "primary"}
            transition="all 0.2s"
            data-test="fileupload-icon-wrapper"
          >
            <Icon size={"md"} data-test="fileupload-upload-icon">
              <FaUpload />
            </Icon>
          </Box>
          <VStack gap={1}>
            <Text fontSize="lg" fontWeight="semibold" color="text" data-test="fileupload-main-text">
              {isDragging ? "Rilascia i file qui" : "Trascina i file qui"}
            </Text>
            <Text fontSize="sm" color="text.muted" data-test="fileupload-secondary-text">
              oppure clicca per selezionare
            </Text>
          </VStack>
          {accept && (
            <Text fontSize="xs" color="text.muted" data-test="fileupload-accept">
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
          p={3}
          bg="red.100"
          borderRadius="md"
          borderLeftWidth="4px"
          borderLeftColor="danger"
          data-test="fileupload-error"
        >
          <Text fontSize="sm" color="danger">
            {error}
          </Text>
        </Box>
      )}

      {selectedFiles.length > 0 && (
        <VStack gap={2} alignItems="stretch" data-test="fileupload-list">
          <Text fontSize="sm" fontWeight="semibold" color="text" data-test="fileupload-count">
            File selezionati ({selectedFiles.length})
          </Text>
          {selectedFiles.map((file, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={3}
              bg="surface"
              borderRadius="lg"
              borderWidth="1px"
              borderColor="border"
              data-test="fileupload-item"
              data-name={file.name}
            >
              <Box display="flex" alignItems="center" gap={3} flex={1} minWidth={0}>
                <Box p={2} borderRadius="md" bg="brand.muted" color="primary" flexShrink={0}>
                  <Icon size={"md"} data-test="fileupload-file-icon">
                    <FaFile />
                  </Icon>
                </Box>
                <Box flex={1} minWidth={0}>
                  <Text
                    fontSize="sm"
                    fontWeight="medium"
                    color="text"
                    overflow="hidden"
                    textOverflow="ellipsis"
                    whiteSpace="nowrap"
                    data-test="fileupload-item-name"
                  >
                    {file.name}
                  </Text>
                  <Text fontSize="xs" color="text.muted" data-test="fileupload-item-size">
                    {formatFileSize(file.size)}
                  </Text>
                </Box>
              </Box>
              <Box
                as="button"
                p={1}
                borderRadius="md"
                color="text.muted"
                onClick={e => {
                  e.stopPropagation();
                  handleRemoveFile(index);
                }}
                data-test="fileupload-remove"
              >
                <Icon size={"md"}>
                  <FaTimes />
                </Icon>
              </Box>
            </Box>
          ))}
        </VStack>
      )}
    </VStack>
  );
}
