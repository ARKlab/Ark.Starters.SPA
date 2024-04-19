import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { supportedLngs } from "../../lib/i18n/config";

export const LocaleSwitcher = () => {
    const { i18n } = useTranslation();

    const swith = useCallback(async (k: string) => {
        await i18n.changeLanguage(k)
    }, [i18n]);

    return (
        <Menu>
            {({ isOpen }) => (
                <>
                    <MenuButton
                        as={Button}
                        rightIcon={<ChevronDownIcon />}
                        variant="ghost"
                        isActive={isOpen}
                    >
                        {i18n.resolvedLanguage}
                    </MenuButton>
                    <MenuList>
                        {Object.entries(supportedLngs).map(([k, v]) => (
                            <MenuItem key={k} onClick={async () => swith(k)}>
                                {v}
                            </MenuItem>
                        ))}
                    </MenuList>
                </>
            )}
        </Menu>
    );
}
