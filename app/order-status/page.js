"use client";
import { GetAPI, PostAPI } from "@/api/postApi";
import Loader from "@/components/loader";
import { UsePaymentOrder } from "@/mutation/UpdatePaymentStatus";
import { useApolloClient, useQuery } from "@apollo/client";
import { SfButton, SfIconCancel } from "@storefront-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeJWT } from "../checkout/page";
import { encode } from "@yag/id-hash";

const salt = {
    "keyIndex": 1,
    "key": "3fc78cb4-ee13-4a66-8f6c-b50dda844eb0"
}

const OrderStatus = () => {
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
    // const { data } = useQuery(usernameQuery, { variables: { "_eq": phone }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
    // const { data: orderdetails } = useQuery(GetOrderById, { variables: { "id": order }, context: { headers: { Authorization: `Bearer ${token || superadmin}` } } })



    const cartitems = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("cart_items")) || []

    const userid = token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-user-id']

    let maxSalePriceProduct = null;
    if (cartitems?.length > 0) {
        for (const product of cartitems) {
            if (!maxSalePriceProduct || product?.sale_price > maxSalePriceProduct?.sale_price) {
                maxSalePriceProduct = product;
            }
        }
    }
    // console.log("Product with highest sale price:", maxSalePriceProduct?.qr_id);
    const couponVariables = {
        "qr_id": maxSalePriceProduct?.qr_id,
        "user_id": userid,
    }

    // console.log(data,'data', mailVariables);

    const password = "2D9C14D400EA0E3BE68A7245D1E120DBF68653EAF4ACCB6EC22478A72EB14A4C"
    const ivBytes = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);

    function base64UrlDecode(base64Url) {
        const padding = '='.repeat((4 - base64Url.length % 4) % 4);
        const base64 = (base64Url + padding)
            .replace(/-/g, '+')
            .replace(/_/g, '/');
        const rawData = atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }

    async function decryptText(encryptedText, password) {
        // Decode the base64-encoded string
        const encryptedBytes = base64UrlDecode(encryptedText);
        // Convert password to a byte array
        const enc = new TextEncoder();
        const passwordBytes = enc.encode(password);
        // Create salt from passwordBytes 
        const saltBytes = passwordBytes;
        // Derive key using PBKDF2
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            passwordBytes,
            { name: "PBKDF2" },
            false,
            ["deriveKey"]
        );
        const key = await crypto.subtle.deriveKey(
            {
                name: "PBKDF2",
                salt: saltBytes,
                iterations: 65536,
                hash: "SHA-256"
            },
            keyMaterial,
            { name: "AES-CBC", length: 256 },
            false,
            ["decrypt"]
        );
        // Decrypt the data
        try {
            const decryptedBytes = await crypto.subtle.decrypt(
                {
                    name: "AES-CBC",
                    iv: ivBytes
                },
                key,
                encryptedBytes
            );
            // Decode the decrypted bytes to a string
            const dec = new TextDecoder();
            const decryptedText = dec.decode(decryptedBytes);
            return decryptedText;
        } catch (error) {
            console.error("Error decrypting the data", error)
        }
    }

    let count = 0
    // let interval;
    const paymentCheck = async () => {
        // setCount((pre)=>pre+1)
        setLoad(true)
        const resp = await decryptText(response, password)
        const result = JSON.parse(resp)
        // console.log(result, 'data');
        const [orderId, transId] = result?.customerReference?.split('-')
        const encoded = encode(parseInt(orderId) * 11111)
        const mailVariables = {
            "order_id": orderId,
            "email": result?.payerEmail,
            "order_link": `https://deals.extraa.in/od/${encoded}`
        }
        const desc = `Your+order+number+${orderId}+of+amount+Rs.${result?.amount || 0}+has+been+placed+successfully`

        const items = {
            id: parseInt(transId),
            order_id: parseInt(orderId),
            status: result?.message || 'FAILED',
            metadata: result
        }
        //  console.log(desc,'data');
        const res = await UsePaymentOrder(items, client);
        if ((result?.message == 'SUCCESS'|| result?.message == 'TRANSACTION IS SUCCESSFULL') && count === 0) {
            count += 1
            // whatsapp api
            await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=${result?.debtorName || 'Customer'}&var2=${desc || ''}&var3=https://deals.extraa.in/od/${encoded} `)
            // normal msg api
            await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=1&var1=${orderId}&var2=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707170558637253609&country_code=91&customerMobile=${phone}&varCount=2`)
            // email api
            await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
            // user coupon add api
            // await PostAPI("https://wzputfojcxnmkpncb2dd25jihe0eovtp.lambda-url.ap-south-1.on.aws/", couponVariables)
            route.push(`/success/${orderId}`)
        } else if (count === 0) {
            setErrorLabel('Payment failed ...')
            setShowBtn(true)
        }
        //***************** Phonepe payment gateway code ******************
        // const headers = {
        //     "X-VERIFY": hash,
        //     "X-MERCHANT-ID": "EXTRAAONLINE"
        // }
        // const variables = {
        //     "transaction_id": trans
        // }
        // let code = '#'
        // const result = await PostAPI(`https://pay.extraa.in/payment-status`, variables)
        // //  const result = ''
        // code = result?.data?.code || code
        // const items = {
        //     id: parseInt(trans),
        //     order_id: parseInt(order),
        //     status: code,
        //     // amount: parseFloat(orderdetails?.orders_by_pk?.amount)||0
        // }
        // //  console.log(desc,'data');
        // const resp = await UsePaymentOrder(items, client);

        // if (code === 'BAD_REQUEST') {
        //     setErrorLabel(result?.data?.message || 'Error in your request please try again later...')
        //     setShowBtn(true)
        // } else if (code === 'AUTHORIZATION_FAILED') {
        //     setErrorLabel(result?.data?.message || 'Authorization failed please try again later...')
        //     setShowBtn(true)
        // } else if (code === 'INTERNAL_SERVER_ERROR') {
        //     setErrorLabel(result?.data?.message || 'Internal server error please try again later...')
        //     setShowBtn(true)
        // } else if (code === 'TRANSACTION_NOT_FOUND') {
        //     setErrorLabel(result?.data?.message || 'Transaction not found please try again later...')
        //     setShowBtn(true)
        // } else if (code === 'PAYMENT_ERROR') {
        //     setErrorLabel(result?.data?.message || 'Payment error please try again later...')
        //     setShowBtn(true)
        // } else if (code === 'PAYMENT_PENDING') {
        //     count += 1
        //     if (count < 6) {
        //         setErrorLabel(result?.data?.message || 'Payment pending please wait...')
        //         setShowBtn(false)
        //         if (count === 1) {
        //             interval = setInterval(async () => await paymentCheck(), 5000)
        //         }
        //     } else {
        //         setErrorLabel('Payment still in pending we will let you shortly...')
        //         setHomeShowBtn(true)
        //         clearInterval(interval);
        //     }
        // } else if (code === 'PAYMENT_DECLINED') {
        //     setErrorLabel(result?.data?.message || 'Payment failed...')
        //     setShowBtn(true)
        // } else if (code === 'TIMED_OUT') {
        //     setErrorLabel(result?.data?.message || 'Payment time out please try agian later...')
        //     setShowBtn(true)
        // } else if (code === 'PAYMENT_SUCCESS') {
        //     // whatsapp api
        //     await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=${userName || 'Customer'}&var2=${desc || ''}&var3=https://deals.extraa.in/od/${encoded} `)
        //     // normal msg api
        //     await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=1&var1=${order}&var2=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707170558637253609&country_code=91&customerMobile=${phone}&varCount=2`)
        //     // email api
        //     await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
        //     // user coupon add api
        //     await PostAPI("https://wzputfojcxnmkpncb2dd25jihe0eovtp.lambda-url.ap-south-1.on.aws/", couponVariables)
        //     route.push(`/success/${order}`)
        // } else if ("ERR_BAD_REQUEST") {
        //     setErrorLabel(result?.data?.message || 'Payment time out please try agian later...')
        //     setShowBtn(true)
        // }
        // *************end of phonepe method*************
        setLoad(false)
        // console.log(result, 'res', count)
    }

    useEffect(() => {
        // if (orderdetails && orderdetails?.order_status != 'PAYMENT_SUCCESS') {
        paymentCheck()
        // }
    }, [])

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
                <div className="flex flex-col h-[300px] items-center justify-center gap-3">
                    {/* <Loader /> */}
                    {showBtn && <SfIconCancel className="w-auto h-[70px] mt-5 mb-1.5 text-red-500" />}
                    <h1>{errorLabel}</h1>
                    {showBtn && <SfButton size="sm" className="bg-extraa-blue" onClick={() => route?.push('/tickets')}>
                        Go back
                    </SfButton>
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

export default OrderStatus;