"use client";
import { PostAPI } from "@/api/postApi";
import { SfButton } from "@storefront-ui/react";
import { useEffect, useState } from "react";
import { decode } from "@yag/id-hash";
import { useRouter } from "next/navigation";

const OrderProcessHfdc = ({ params }) => {
    const route = useRouter()
    // const searchParams = useSearchParams()
    // const response = searchParams.get('response')
    const orderId = decode(params?.id) / 11111;
    // const hash = sha256(`/pg/v1/status/EXTRAAONLINE/${trans}` + salt?.key) + '###1';
    const [errorLabel, setErrorLabel] = useState('Please wait we will redirect you...')
    const [showBtn, setShowBtn] = useState(false)
    const [showHomeBtn, setHomeShowBtn] = useState(false)
    const [load, setLoad] = useState(false)

    let count = 0
    let interval;

    const paymentCheck = async () => {
        setLoad(true)
        const { data } = await PostAPI("https://pay.extraa.in/handleJuspayResponse", { "order_id": orderId.toString() })
        // console.log(data, 'res');

        let message = ''
        switch (data.order_status) {
            // switch ("PENDING") {
            case "CHARGED":
                message = "order payment done successfully"
                route.push(`/success/${orderId}`)
                break
            case "PENDING":
                count += 1
                if (count < 6) {
                    message = 'Payment pending please wait...'
                    setShowBtn(false)
                    if (count === 1) {
                        interval = setInterval(async () => await paymentCheck(), 5000)
                    }
                } else {
                    message = 'Payment still in pending we will let you shortly...'
                    setHomeShowBtn(true)
                    clearInterval(interval);
                }
                break
            case "PENDING_VBV":
                message = "Payment pending please wait..."
                break
            case "AUTHORIZATION_FAILED":
                setShowBtn(true)
                message = "order payment authorization failed"
                break
            case "AUTHENTICATION_FAILED":
                setShowBtn(true)
                message = "order payment authentication failed"
                break
            case "NEW":
                setShowBtn(true)
                message = "order payment failed"
                break
            default:
                message = "Unknow order status we will get back to you in 15 minutes"
                break
        }
        setErrorLabel(message)
        // console.log(data, 'reslut');
        setLoad(false)
    }

    useEffect(() => {
        // if (data?.users?.length > 0) {
        paymentCheck()
        // }
    }, [])

    return (
        <div className="h-[60vh] flex justify-center items-center">
            {load ?
                <div >
                    <div className="flex  w-full justify-center items-center">
                        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    </div>
                    <div className="p-5">
                        <p className="gradient-text gradientAnimation text-center font-extrabold text-transparent text-lg md:text-2xl">Please Wait while we are processing your request...</p>
                        <p className="mt-5 text-center font-semibold">Please Do not press back button or refresh the page</p>
                    </div>
                </div>
                :
                <div className="flex flex-col h-[300px] items-center justify-center">
                    {/* <Loader /> */}
                    <h1>{errorLabel}</h1>
                    {showBtn && <SfButton size="sm" className="bg-[#DE282A]" onClick={() => route?.push('/')}>
                        Go back
                    </SfButton>
                    }
                    {showHomeBtn && <SfButton size="sm" className="bg-[#DE282A]" onClick={() => route?.push('/')}>
                        Go home
                    </SfButton>
                    }
                </div>
            }
        </div>
    )
}

export default OrderProcessHfdc;