import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button } from '@chakra-ui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { If, Then } from 'react-if';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/react'


export const PWABadge = () => {
    const period = 1000 * 60 * 2; //ms

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            if (period <= 0) return
            if (r?.active?.state === 'activated') {
                registerPeriodicSync(period, swUrl, r)
            }
            else if (r?.installing) {
                r.installing.addEventListener('statechange', (e) => {
                    const sw = e.target as ServiceWorker
                    if (sw.state === 'activated')
                        registerPeriodicSync(period, swUrl, r)
                })
            }
        },
    })

    function onClose() {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    const cancelRef = useRef<HTMLButtonElement | null>(null);
    const { t } = useTranslation();

    return (<AlertDialog
        isOpen={offlineReady || needRefresh}
        leastDestructiveRef={cancelRef}
        closeOnOverlayClick={false}
        onClose={onClose}
    >
        <AlertDialogOverlay>
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                    <If condition={offlineReady}><Then>{t('pwaBadge.offlineReady.title')}</Then></If>
                    <If condition={needRefresh}><Then>{t('pwaBadge.newVersion.title')}</Then></If>
                </AlertDialogHeader>
                <AlertDialogCloseButton />

                <AlertDialogBody>
                    <If condition={offlineReady}><Then>{t('pwaBadge.offlineReady.body')}</Then></If>
                    <If condition={needRefresh}><Then>{t('pwaBadge.newVersion.body')}</Then></If>
                </AlertDialogBody>

                <AlertDialogFooter>
                    <Button ref={cancelRef} onClick={onClose}>
                        {t('pwaBadge.button.close')}
                    </Button>
                    <If condition={needRefresh}>
                        <Then>
                            <Button colorScheme='green' onClick={async () => updateServiceWorker(true)} ml={3}>
                                {t('pwaBadge.button.refresh')}
                            </Button>
                        </Then>
                    </If>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialogOverlay>
    </AlertDialog>
    );
}



/**
 * This function will register a periodic sync check every hour, you can modify the interval as needed.
 */
function registerPeriodicSync(period: number, swUrl: string, r: ServiceWorkerRegistration) {
    if (period <= 0) return

    const f = async () => {
        if (r.installing)
            return

        if (('connection' in navigator) && !navigator.onLine)
            return
        const resp = await fetch(swUrl, {
            cache: 'no-store',
            headers: {
                'cache': 'no-store',
                'cache-control': 'no-cache',
            },
        }).catch(_ => { return null; });

        if (resp?.status === 200)
            await r.update()
    };

    f().then(_ => setInterval(f, period)).catch(_ => null);
}