import {
  Button,
  Text,
  Link,
  useDisclosure,
  DialogRoot,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogBackdrop,
  Spacer,
  Group,
  Box,
  VStack,
  Flex,
  Icon,
  Separator,
} from "@chakra-ui/react";
import { useRef, type ReactNode } from "react";
import { Form, useField } from "react-final-form";
import { Trans, useTranslation } from "react-i18next";
import { FaCookieBite } from "react-icons/fa";
import { If, Then } from "react-if";

import { cookiePolicyHref, hasPreferencesCookies, hasStatisticsCookies, hasMarketingCookies } from "../config/gdpr";
import { LocaleSwitcher } from "../lib/i18n/localeSwitcher";
import type { ConsentState } from "../lib/useGDPRConsent";
import { useCookieConsent } from "../lib/useGDPRConsent"

import { Field } from "./ui/field";
import { Switch } from "./ui/switch";


const Option = ({ title, desc, name }: { title: ReactNode, desc: ReactNode, name: string }) => {
    const { input: { checked, value, ...input }
    } = useField<boolean>(name, { type: 'checkbox' });

    return (
      <Field id={name} label={title} helperText={desc}>
        <Flex minWidth="max-content" alignItems="center" gap="2">
          {/*<Box p='2'>
                    <FormLabel htmlFor={name} size='md' >{title}</FormLabel>
                </Box>
                <Spacer />*/}
          <Switch {...input} colorScheme="teal" size="lg" checked={checked} readOnly={name === "necessary"} />
        </Flex>
      </Field>
    );
}

export const GdprConsentDialog = () => {
    const [consent, actions] = useCookieConsent();
    const closeRef = useRef<HTMLButtonElement>(null);
    const { open, onOpen, onClose } = useDisclosure();
    const { t } = useTranslation('gdpr');

    if (consent)
        return <></>

    return (
      <>
        <DialogRoot
          open={true}
          role={"alertdialog"}
          onOpenChange={actions.rejectNotNecessary}
          placement={"center"}
          scrollBehavior={"inside"}
          size={"xl"}
        >
          <DialogBackdrop>
            <DialogContent>
              <DialogHeader fontSize="lg" fontWeight="bold">
                <Text>
                  {/*<Icon mr={1} as={FaCookieBite} />*/}
                  <Trans t={t} i18nKey="title">
                    We've Cookies!
                  </Trans>
                </Text>
              </DialogHeader>
              <DialogBody>
                <Text>
                  <Trans t={t} i18nKey="policy">
                    We and selected third parties use cookies or similar technologies for technical purposes and, with
                    your consent, for other purposes as specified in the{" "}
                    <Link href={cookiePolicyHref} target="_blank" rel="noopener noreferrer">
                      {" "}
                      cookie policy{" "}
                    </Link>
                    . .
                  </Trans>
                </Text>
              </DialogBody>
              <DialogFooter gap={2}>
                <Group gap={1}>
                  <Button colorScheme="gray" onClick={onOpen}>
                    Customize
                  </Button>
                  <LocaleSwitcher></LocaleSwitcher>
                </Group>
                <Spacer />
                <Group gap={1}>
                  <Button
                    ref={closeRef}
                    onClick={() => {
                      actions.rejectNotNecessary();
                      onClose();
                    }}
                    data-role="gdpr-reject"
                  >
                    {t("reject")}
                  </Button>
                  <Button
                    colorScheme="red"
                    onClick={() => {
                      actions.acceptAll();
                      onClose();
                    }}
                    ml={3}
                    data-role="gdpr-acceptAll"
                  >
                    {t("acceptAll")}
                  </Button>
                </Group>
              </DialogFooter>
            </DialogContent>
          </DialogBackdrop>
        </DialogRoot>
        <Form<ConsentState>
          onSubmit={values => {
            actions.acceptSome(values);
          }}
          initialValues={{ necessary: true }}
          render={({ handleSubmit, form }) => (
            <DialogRoot
              open={open}
              onOpenChange={() => {
                form.reset({ necessary: true });
                onClose();
              }}
              placement={"center"}
              size={"xl"}
              scrollBehavior="inside"
            >
              <DialogBackdrop />
              <DialogContent as={"form"} onSubmit={handleSubmit}>
                <DialogHeader>
                  <Trans t={t} i18nKey="title">
                    We've Cookies!
                  </Trans>
                </DialogHeader>
                <DialogBody>
                  <VStack separator={<Separator borderColor="gray.200" />} gap={4} align="stretch">
                    <Text>
                      <Trans t={t} i18nKey="customize">
                        The options provided in this section allow you to customize your consent preferences for any
                        tracking technology used for the purposes described below. To learn more about how these
                        trackers help us and how they work, refer to the{" "}
                        <Link href={cookiePolicyHref} target="_blank" rel="noopener noreferrer">
                          cookie policy
                        </Link>
                        . Please be aware that denying consent for a particular purpose may make related features
                        unavailable.
                      </Trans>
                    </Text>
                    <Option title={t("necessary.title")} desc={t("necessary.description")} name="necessary" />
                    <If condition={hasStatisticsCookies}>
                      <Then>
                        <Option title={t("statistics.title")} desc={t("statistics.description")} name="statistics" />
                      </Then>
                    </If>
                    <If condition={hasPreferencesCookies}>
                      <Then>
                        <Option title={t("preferences.title")} desc={t("preferences.description")} name="preferences" />
                      </Then>
                    </If>
                    <If condition={hasMarketingCookies}>
                      <Then>
                        <Option title={t("marketing.title")} desc={t("marketing.description")} name="marketing" />
                      </Then>
                    </If>
                  </VStack>
                </DialogBody>

                <DialogFooter gap={2}>
                  <Box>
                    <Button
                      colorScheme="gray"
                      onClick={() => {
                        form.reset({ necessary: true });
                        onClose();
                      }}
                    >
                      Back
                    </Button>
                  </Box>
                  <Spacer />
                  <Group gap={1}>
                    <Button colorScheme="red" type="submit">
                      {t("accept")}
                    </Button>
                  </Group>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          )}
        />
      </>
    );
}