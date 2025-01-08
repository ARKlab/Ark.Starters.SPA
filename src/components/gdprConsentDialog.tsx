/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Flex, FormControl, FormHelperText, FormLabel, Icon, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spacer, StackDivider, Switch, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useRef, type ReactNode } from "react";
import type { Control } from "react-hook-form";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { FaCookieBite } from "react-icons/fa";

import { cookiePolicyHref, hasMarketingCookies, hasPreferencesCookies, hasStatisticsCookies } from "../config/gdpr";
import { LocaleSwitcher } from "../lib/i18n/localeSwitcher";
import type { ConsentState } from "../lib/useGDPRConsent";
import { useCookieConsent } from "../lib/useGDPRConsent";


type OptionProps = {
	title: ReactNode,
	desc: ReactNode,
	name: string,
	control: Control,
	required?: boolean
};

function Option(props: OptionProps) {
	const { title, desc, name, control, required } = props;

	return <FormControl id={name}>
		<Flex minWidth='max-content' alignItems='center' gap='2'>
			<Box p='2'>
				<FormLabel htmlFor={name} size='md'>{title}</FormLabel>
			</Box>
			<Spacer />
			<Controller
				name={name}
				control={control}
				render={({ field }) => (
					<Switch {...field} colorScheme='teal' size='lg' isChecked={field.value} isReadOnly={required} />
				)}
			/>
		</Flex>
		<FormHelperText mt={4}>{desc}</FormHelperText>
	</FormControl>
};

export const GdprConsentDialog = () => {
	const [consent, actions] = useCookieConsent();
	const closeRef = useRef<HTMLButtonElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { t } = useTranslation('gdpr');

	const { handleSubmit, control, reset } = useForm<ConsentState>({
		defaultValues: { necessary: true },
	});

	if (consent)
		return <></>

	const onSubmit = (values: ConsentState) => {
		actions.acceptSome(values);
		onClose();
	};

	return (
		<>
			<AlertDialog
				isOpen={true}
				leastDestructiveRef={closeRef}
				closeOnOverlayClick={false}
				onClose={actions.rejectNotNecessary}
				closeOnEsc={false}
				isCentered={true}
				scrollBehavior={'inside'}
				size={'xl'}
			>
				<AlertDialogOverlay>
					<AlertDialogContent>
						<AlertDialogHeader fontSize="lg" fontWeight="bold">
							<Text><Icon mr={1} as={FaCookieBite} /><Trans t={t} i18nKey="title">We've Cookies!</Trans></Text>
						</AlertDialogHeader>
						<AlertDialogBody>
							<Text>
								<Trans t={t} i18nKey="policy">
									We and selected third parties use cookies or similar technologies for technical purposes and, with your consent, for other purposes as specified in the <Link href={cookiePolicyHref} isExternal>cookie policy</Link>.
								</Trans>
							</Text>
						</AlertDialogBody>
						<AlertDialogFooter gap={2}>
							<ButtonGroup gap={1}>
								<Button colorScheme="gray" onClick={onOpen}>Customize</Button>
								<LocaleSwitcher></LocaleSwitcher>
							</ButtonGroup>
							<Spacer />
							<ButtonGroup gap={1}>

								<Button ref={closeRef} onClick={() => { actions.rejectNotNecessary(); onClose(); }} data-role='gdpr-reject'>
									{t('reject')}
								</Button>
								<Button colorScheme="red" onClick={() => { actions.acceptAll(); onClose(); }} ml={3} data-role='gdpr-acceptAll'>
									{t('acceptAll')}
								</Button>

							</ButtonGroup>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialogOverlay>
			</AlertDialog>


			<Modal
				isOpen={isOpen}
				onClose={() => { reset({ necessary: true }); onClose() }}
				isCentered={true}
				size={'xl'}
				scrollBehavior="inside"
			>
				<ModalOverlay />
				<ModalContent as={"form"} onSubmit={handleSubmit(onSubmit)}>
					<ModalHeader>
						<Trans t={t} i18nKey="title">We've Cookies!</Trans>
					</ModalHeader>

					<ModalBody>
						<VStack
							divider={<StackDivider borderColor='gray.200' />}
							spacing={4}
							align='stretch'
						>
							<Text>
								<Trans t={t} i18nKey="customize">
									The options provided in this section allow you to customize your consent preferences for any tracking technology used for the purposes described below.
									To learn more about how these trackers help us and how they work, refer to the <Link href={cookiePolicyHref} isExternal>cookie policy</Link>.
									Please be aware that denying consent for a particular purpose may make related features unavailable.
								</Trans>
							</Text>
							<Option
								title={t('necessary.title')}
								desc={t('necessary.description')}
								name="necessary"
								control={control}
								required
							/>
							{
								hasStatisticsCookies &&
								<Option
									title={t('statistics.title')}
									desc={t('statistics.description')}
									name="statistics"
									control={control}
								/>
							}

							{
								hasPreferencesCookies &&
								<Option
									title={t('preferences.title')}
									desc={t('preferences.description')}
									name="preferences"
									control={control}
								/>
							}
							{
								hasMarketingCookies &&
								<Option
									title={t('marketing.title')}
									desc={t('marketing.description')}
									name="marketing"
									control={control}
								/>
							}
						</VStack>
					</ModalBody>

					<ModalFooter gap={2}>
						<Box>
							<Button
								colorScheme="gray"
								onClick={() => { reset({ necessary: true }); onClose() }}
							>
								Back
							</Button>
						</Box>
						<Spacer />
						<ButtonGroup gap={1}>
							<Button colorScheme="red" type="submit">
								{t('accept')}
							</Button>
						</ButtonGroup>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}