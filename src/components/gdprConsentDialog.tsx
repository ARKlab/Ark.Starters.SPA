/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
  Box,
  Button,
  ButtonGroup,
  Field,
  FieldHelperText,
  FieldLabel,
  Flex,
  Icon,
  Link,
  Spacer,
  StackSeparator,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useRef, type ReactNode } from "react";
import type { Control } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { LuCookie } from "react-icons/lu";

import {
  cookiePolicyHref,
  hasMarketingCookies,
  hasPreferencesCookies,
  hasStatisticsCookies,
} from "../config/gdpr";
import { LocaleSwitcher } from "../lib/i18n/localeSwitcher";
import type { ConsentState } from "../lib/useGDPRConsent";
import { useCookieConsent } from "../lib/useGDPRConsent";

import { DialogBody, DialogContent, DialogFooter, DialogHeader, DialogRoot } from "./ui/dialog";
import { Switch } from "./ui/switch";

type OptionProps = {
  title: ReactNode;
  desc: ReactNode;
  name: string;
  control: Control;
  required?: boolean;
};

function Option(props: OptionProps) {
  const { title, desc, name, control, required } = props;

  return (
    <Field.Root id={name}>
      <Flex minWidth="max" alignItems="center" gap="2">
        <Box p="2">
          <FieldLabel htmlFor={name}>{title}</FieldLabel>
        </Box>
        <Spacer />
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Switch
              {...field}
              size="lg"
              checked={field.value}
              readOnly={required}
            />
          )}
        />
      </Flex>
      <FieldHelperText mt={"4"}>{desc}</FieldHelperText>
    </Field.Root>
  );
}

export const GdprConsentDialog = () => {
  const [consent, actions] = useCookieConsent();
  const ref = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { open, onOpen, onClose } = useDisclosure();
  const { t } = useTranslation("gdpr");

  const { handleSubmit, control, reset } = useForm<ConsentState>({
    defaultValues: { necessary: true },
  });

  if (consent) return <></>;

  const onSubmit = (values: ConsentState) => {
    actions.acceptSome(values);
    onClose();
  };

  return (
    <>
      <DialogRoot
        role="alertdialog"
        open={true}
        initialFocusEl={() => ref.current}
        onExitComplete={actions.rejectNotNecessary}
        scrollBehavior={"inside"}
        size={"xl"}
      >
        <DialogContent ref={contentRef}>
          <DialogHeader fontSize="lg" fontWeight="bold">
            <Text>
              <Icon mr={"1"} as={LuCookie} />
              <Trans t={t} i18nKey="title">
                We've Cookies!
              </Trans>
            </Text>
          </DialogHeader>
          <DialogBody>
            <Text>
              <Trans t={t} i18nKey="policy">
                We and selected third parties use cookies or similar technologies for technical
                purposes and, with your consent, for other purposes as specified in the{" "}
                <Link href={cookiePolicyHref}>cookie policy</Link>.
              </Trans>
            </Text>
          </DialogBody>
          <DialogFooter gap={"2"}>
            <ButtonGroup gap={"1"}>
              <Button onClick={onOpen}>Customize</Button>
              <LocaleSwitcher portalRef={contentRef}></LocaleSwitcher>
            </ButtonGroup>
            <Spacer />
            <ButtonGroup gap={"1"}>
              <Button
                ref={ref}
                onClick={() => {
                  actions.rejectNotNecessary();
                  onClose();
                }}
                data-test="gdpr-reject"
              >
                {t("reject")}
              </Button>
              <Button
                colorPalette="red"
                onClick={() => {
                  actions.acceptAll();
                  onClose();
                }}
                ml={"3"}
                data-test="gdpr-acceptAll"
              >
                {t("acceptAll")}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>

      <DialogRoot
        open={open}
        onExitComplete={() => {
          reset({ necessary: true });
          onClose();
        }}
        size={"xl"}
        scrollBehavior="inside"
      >
        <DialogContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <Trans t={t} i18nKey="title">
              We've Cookies!
            </Trans>
          </DialogHeader>

          <DialogBody>
            <VStack separator={<StackSeparator borderColor="fg.muted" />} gap={"4"} align="stretch">
              <Text>
                <Trans t={t} i18nKey="customize">
                  The options provided in this section allow you to customize your consent
                  preferences for any tracking technology used for the purposes described below. To
                  learn more about how these trackers help us and how they work, refer to the{" "}
                  <Link href={cookiePolicyHref}>cookie policy</Link>. Please be aware that denying
                  consent for a particular purpose may make related features unavailable.
                </Trans>
              </Text>
              <Option
                title={t("necessary.title")}
                desc={t("necessary.description")}
                name="necessary"
                control={control}
                required
              />
              {hasStatisticsCookies && (
                <Option
                  title={t("statistics.title")}
                  desc={t("statistics.description")}
                  name="statistics"
                  control={control}
                />
              )}

              {hasPreferencesCookies && (
                <Option
                  title={t("preferences.title")}
                  desc={t("preferences.description")}
                  name="preferences"
                  control={control}
                />
              )}
              {hasMarketingCookies && (
                <Option
                  title={t("marketing.title")}
                  desc={t("marketing.description")}
                  name="marketing"
                  control={control}
                />
              )}
            </VStack>
          </DialogBody>

          <DialogFooter gap={"2"}>
            <Box>
              <Button
                onClick={() => {
                  reset({ necessary: true });
                  onClose();
                }}
              >
                Back
              </Button>
            </Box>
            <Spacer />
            <ButtonGroup gap={"1"}>
              <Button colorPalette="red" type="submit">
                {t("accept")}
              </Button>
            </ButtonGroup>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
