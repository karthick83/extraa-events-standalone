import { useId, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import { SfModal, SfButton, SfIconClose, useDisclosure } from '@storefront-ui/react';

export default function AlertModal({ isOpen, open, close, toggleLeave }) {
    const headingId = useId();
    const descriptionId = useId();
    const modalRef = useRef(null);
    const backdropRef = useRef(null);

    return (
        <>
            {/* Backdrop */}
            <CSSTransition
                in={isOpen}
                nodeRef={backdropRef}
                timeout={200}
                unmountOnExit
                classNames={{
                    enter: 'opacity-0',
                    enterDone: 'opacity-100 transition duration-200 ease-out',
                    exitActive: 'opacity-0 transition duration-200 ease-out',
                }}
            >
                <div ref={backdropRef} className="fixed inset-0 bg-neutral-700 bg-opacity-50" />
            </CSSTransition>

            {/* Modal */}
            <CSSTransition
                in={isOpen}
                nodeRef={modalRef}
                timeout={200}
                unmountOnExit
                classNames={{
                    enter: 'translate-y-10 opacity-0',
                    enterDone: 'translate-y-0 opacity-100 transition duration-200 ease-out',
                    exitActive: 'translate-y-10 opacity-0 transition duration-200 ease-out',
                }}
            >
                <SfModal
                    open
                    onClose={close}
                    ref={modalRef}
                    as="section"
                    role="alertdialog"
                    aria-labelledby={headingId}
                    aria-describedby={descriptionId}
                    className="max-w-[90%] md:max-w-lg"
                >
                    <header>
                        <SfButton square variant="tertiary" className="absolute right-2 top-2" onClick={close}>
                            <SfIconClose />
                        </SfButton>
                        <h3 id={headingId} className="font-bold typography-headline-4 md:typography-headline-3">
                            Do you want to leave this page?
                        </h3>
                    </header>
                    <p id={descriptionId} className="mt-2">
                        You will lose your information if you go back.
                    </p>
                    <footer className="flex justify-center gap-4 mt-4">
                        <SfButton className='bg-green-700 mt-2' onClick={close}>
                            Cancel
                        </SfButton>
                        <SfButton className='bg-red-700 mt-2' onClick={toggleLeave}>Leave!</SfButton>
                    </footer>
                </SfModal>
            </CSSTransition>
        </>
    );
}
