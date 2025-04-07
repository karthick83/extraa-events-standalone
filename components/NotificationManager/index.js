import { SfIconCheckCircle, SfIconClose, SfIconCloseSm, SfIconError, SfIconWarning } from '@storefront-ui/react';
import { useEffect, useState } from 'react';
import './notification.css';

const NotificationManager = ({ message, alertType, offset }) => {
    const [error, setError] = useState(true)
    // alert type 0-error, 1-success, 2-warning 
    let css = {
        bg: offset ? 'flex inset-x-0 z-50  mx-auto w-fit shadow-md max-w-[600px] bg-[#DCFCE7]  text-black pr-2 pl-4 mb-2 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md' : 'flex fixed inset-x-0 z-50  mx-auto w-fit shadow-md max-w-[600px] bg-[#DCFCE7]  text-black pr-2 pl-4 mb-2 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md',
        btn: "hidden md:block text-[#018937]"
    }
    if (alertType === 0) {
        css = {
            bg: "flex fixed inset-x-0 z-50 top-0 right-0 mx-auto w-fit max-w-[600px] shadow-md bg-[#FF5555]  mt-2 pr-2 pl-4 ring-1 ring-negative-300 typography-text-sm md:typography-text-base py-1 rounded-md",
            btn: "hidden md:block"
        }
    } else if (alertType === 2) {
        css = {
            bg: "flex fixed inset-x-0 z-50 top-0 right-0 mx-auto w-fit shadow-md max-w-[600px] bg-yellow-300 mt-2 pr-2 pl-4 mb-2 ring-1 ring-positive-200 typography-text-sm md:typography-text-base py-1 rounded-md",
            btn: "hidden md:block"
        }
    }

    let progress = "progress"
    let head="Success"
    let bg='!bg-[#D9FDE4]'
    if (alertType === 2) {
        progress = "progressWarn"
        head= "Warning"
        bg='!bg-[#f7f7a5]'
    } else if (alertType === 0) {
        progress = 'progressError'
        head="Error"
        bg="!bg-[#FFE8ED]"
    }

    useEffect(() => {
        setTimeout(() => setError(false), 5000);
    }, [])

    return (
        <>
            {error &&
                // <div
                //     role="alert"
                //     className={css.bg}
                //     style={{ top: offset || 0 }}
                // >
                //     {alertType === 1 && <SfIconCheckCircle className="my-2 mr-2 text-positive-700 shrink-0 text-[#018937]" />}
                //     {alertType === 2 && <SfIconWarning className="mt-2 mr-2 text-warning-700 shrink-0" />}
                //     {alertType === 0 && <SfIconError className="mr-2 my-2 text-positive-700" />}
                //     <p className="rota-sb py-2 mr-2">{message}</p>
                //     <button
                //         type="button"
                //         className="p-1.5 md:p-2 ml-auto rounded-md text-positive-700 hover:bg-positive-200 active:bg-positive-300 hover:text-positive-800 active:text-positive-900 focus-visible:outline focus-visible:outline-offset"
                //         aria-label="Close positive alert"
                //         onClick={() => setError(false)}
                //     >
                //         <SfIconClose className={css.btn} />
                //         <SfIconClose size="sm" className="block md:hidden" />
                //     </button>
                // </div>
                <div className={`toasts ${error ? "active" : ""} ${bg}`}>
                    <div className="toasts-content">
                        {alertType === 1 && <SfIconCheckCircle className="my-2 mr-2 text-positive-700 shrink-0 text-[#018937]" />}
                        {alertType === 2 && <SfIconWarning className="mt-2 mr-2 text-warning-700 shrink-0 text-[#FEC447]" />}
                        {alertType === 0 && <SfIconError className="mr-2 my-2 text-positive-700 text-[#e4111d]" />}
                        <div className="message">
                            <span className="text text-1 uc-medium">{head}</span>
                            <p className="text uc-medium">{message}</p>
                        </div>
                    </div>
                    <SfIconCloseSm className="close" onClick={() => setError(false)} />
                    <div className={`${progress} ${error ? "active" : ""}`}></div>
                </div>
            }
        </>
    )
}

export default NotificationManager;