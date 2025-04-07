"use client";
import { AisensySendWhatsApp, GetAPI, PostAPI } from "@/api/postApi";
import Loader from "@/components/loader";
import { UsePaymentOrder } from "@/mutation/UpdatePaymentStatus";
import { useApolloClient, useQuery } from "@apollo/client";
import { SfButton, SfIconCancel } from "@storefront-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeJWT } from "../checkout/page";
import { encode } from "@yag/id-hash";
import { AES, enc } from "crypto-js";
import { decodeAndDecrypt } from "@/common/encryptDecryptFunc";
import { usernameQuery } from "@/queries/GetUserDetails";
import { superadmin } from "../page";

const OrderProcess = () => {
    const route = useRouter()
    const searchParams = useSearchParams()
    // const trans = searchParams.get('trans')
    // const order = searchParams.get('order')
    // const order = searchParams.get('order')
    // const [order, setOrder] = useState(0)
    // const [trans, setTrans] = useState(0)
    const response = searchParams.get('response')
    // const orderId = decode(encoded) /11111
    const client = useApolloClient()
    // const hash = sha256(`/pg/v1/status/EXTRAAONLINE/${trans}` + salt?.key) + '###1';
    const [errorLabel, setErrorLabel] = useState('Please wait we will redirect you...')
    const [showBtn, setShowBtn] = useState(false)
    const [showHomeBtn, setHomeShowBtn] = useState(false)
    const [load, setLoad] = useState(false)
    // const [count, setCount] = useState(0)
    // console.log(encoded, 'decode', trans, order, orderId);
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const phone = token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-phone'] || ""
    // const totalAmt = typeof localStorage !== 'undefined' && localStorage?.getItem("totalAmt") || 0
    // const userName = typeof localStorage !== 'undefined' && localStorage?.getItem("user_name") || 0
    const { data } = useQuery(usernameQuery, { variables: { "_eq": phone }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
    // const { data: orderdetails } = useQuery(GetOrderById, { variables: { "id": order }, context: { headers: { Authorization: `Bearer ${token || superadmin}` } } })

    const cartitems = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("cart_items")) || []

    const userid = token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-user-id']
const name =data?.users?.length > 0 &&data?.users[0]?.name
    let maxSalePriceProduct = null;
    if (cartitems?.length > 0) {
        for (const product of cartitems) {
            if (!maxSalePriceProduct || product?.sale_price > maxSalePriceProduct?.sale_price) {
                maxSalePriceProduct = product;
            }
        }
    }
    // console.log("Product with highest sale price:", maxSalePriceProduct?.qr_id)

    // console.log(data,'data', mailVariables);
    let count = 0
    // let interval;
    const paymentCheck = async () => {
        // setCount((pre)=>pre+1)
        setLoad(true)
        const result = decodeAndDecrypt(response, '20aserasecretkey24')
        const OrderPaymentStatus = JSON.parse(result).returning[0].order_status
        const amt = JSON.parse(result).returning[0].amount
        const orderID = JSON.parse(result).returning[0].id
        const encoded = encode(orderID * 11111)
        const mailVariables = {
            "order_id": orderID?.toString(),
            "email": data?.users?.length > 0 && data?.users[0]?.email,
            "order_link": ` https://zoominfo.extraa.in/od/${encoded}`,
            "merchant_name":"order_confirmation"
        }
        if (OrderPaymentStatus === 'PAYMENT_SUCCESS') {
            // console.log(result, 'res');
            const desc = `Your+order+number+${orderID}+for+amount+Rs.${amt}+has+been+placed+successfully`
            if (count === 0) {
                // Whatsapp msg api
                // await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=customer&var2=${desc || ''}&var3=${encoded}`)
                await AisensySendWhatsApp(name,phone,orderID,encoded)
                
                // // normal msg api
                // await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=1&var1=${orderID}&var2=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707170558637253609&country_code=91&customerMobile=${phone}&varCount=2`)
                // await GetAPI(`https://sms.extraa.in/SMSApi/send?userid=extraasms&password=123456&sendMethod=quick&mobile=${phone}&msg=Dear+Sir%2FMadam+Your+Order+%23${orderID}+has+confirmed.+Go+to+https%3A%2F%2Fdeals.extraa.in%2Fod%3Fkey=${encoded}+to+view+your+orders.+-+Team+Extraa&senderid=EXTAAA&msgType=text&dltEntityId=1201159947662865256&dltTemplateId=1707173174949380641&duplicatecheck=true&output=json`)
                await GetAPI(`https://sms.extraa.in/SMSApi/send?userid=extraasms&password=123456&sendMethod=quick&mobile=${phone}&msg=Dear+Sir%2FMadam+Your+Order+%23${orderID}+has+confirmed.+Go+to+https%3A%2F%2Fzoominfo.extraa.in%2Fod%3Fkey=${encoded}+to+view+your+orders.+-+Team+Extraa&senderid=EXTAAA&msgType=text&dltEntityId=1201159947662865256&dltTemplateId=1707173199916450014&duplicatecheck=true&output=json`)

                // // email api link
                await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
                count += 1
            }

            route?.push(`/success/${orderID}`)
        } else {
            setShowBtn(true)
            setErrorLabel('Something went wrong or please try again later')
            // await AisensySendWhatsApp(name,phone,orderID,encoded)

        }
        setLoad(false)
    }

    useEffect(() => {
        if (data?.users?.length > 0) {
            paymentCheck()
        }
    }, [data])

    return (
        <div className="h-[80vh] flex flex-col items-center justify-center">
            {load ?
                <div  >
                    <Loader />
                    <div className="p-5">
                        <p className="gradient-text gradientAnimation text-center font-extrabold text-transparent text-lg md:text-2xl">Please Wait while we are processing your request...</p>
                        <p className="mt-5 text-center font-semibold">Please Do not press back button or refresh the page</p>
                    </div>


                </div>
                :
                <div className="flex flex-col h-[300px] items-center justify-center gap-3 p-4">
                    {/* <Loader /> */}
                    {showBtn && <SfIconCancel className="w-auto h-[70px] mt-5 mb-1.5 text-red-500" />}
                    <h1 className="font-bold text-base md:text-xl uc-sb text-center">{errorLabel}</h1>
                    {showBtn &&
                        <>
                        <p className="uc-regular text-center">If your payment has been deducted, and the refund will be processed within one to two working days.</p>
                            <SfButton size="sm" className="bg-extraa-blue" onClick={() => route?.push('/')}>
                                Go back
                            </SfButton>
                        </>
                    }
                    {showHomeBtn &&
                        <div>
                            <SfButton size="sm" className="bg-extraa-blue" onClick={() => route?.push('/')}>
                                Go home
                            </SfButton>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default OrderProcess;