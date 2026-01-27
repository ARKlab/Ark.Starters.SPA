import { Box, Button, HStack, Icon, Text } from "@chakra-ui/react";
import { useTranslation } from "react-i18next";
import { LuX } from "react-icons/lu";

import type { ActiveFilter } from "./Filters";

interface ActiveFiltersBarProps {
  filters: ActiveFilter[];
  onRemoveFilter: (filterId: string) => void;
  onClearAll: () => void;
}

export function ActiveFiltersBar(props: ActiveFiltersBarProps) {
  const { filters, onRemoveFilter, onClearAll } = props;

  const { t } = useTranslation();

  if (filters.length === 0) return null;

  return (
    <Box p="4" bg="bg.panel" borderRadius="lg" border="xs" borderColor="brand.emphasized">
      <HStack justify="space-between" mb="3">
        <Text fontWeight="semibold" fontSize="sm" color="fg.muted">
          {t("filters.active_filters")} ({filters.length})
        </Text>
        <Button variant="ghost" size="xs" colorPalette="red" onClick={onClearAll}>
          {t("filters.clear_all")}
        </Button>
      </HStack>
      <HStack gap="2" flexWrap="wrap">
        {filters.map(filter => (
          <Box
            key={filter.filterId}
            display="inline-flex"
            alignItems="center"
            gap="2"
            px="3"
            py="1.5"
            bg="bg"
            borderRadius="full"
            fontSize="sm"
            transition="all"
            transitionDuration="fast"
            _hover={{
              bg: "brand.emphasized",
            }}
          >
            <Text fontWeight="medium">{filter.label}:</Text>
            <Text>{filter.displayValue}</Text>
            <Button
              variant="ghost"
              size="xs"
              onClick={() => {
                onRemoveFilter(filter.filterId);
              }}
              color="fg"
              minW="fit"
              h="fit"
              p={"0"}
              _hover={{ bg: "transparent/80" }}
              aria-label={`Rimuovi filtro ${filter.label}`}
            >
              <Icon size="md" as={LuX} />
            </Button>
          </Box>
        ))}
      </HStack>
    </Box>
  );
}
