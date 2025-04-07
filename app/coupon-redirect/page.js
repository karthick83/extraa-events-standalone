"use client";
import { GetAPI, PostAPI } from "@/api/postApi";
import Loader from "@/components/loader";
import { UsePaymentOrder, UsePaymentOrderTickets } from "@/mutation/UpdatePaymentStatus";
import { useApolloClient, useQuery } from "@apollo/client";
import { SfButton } from "@storefront-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeJWT } from "../checkout/page";
import { encode } from "@yag/id-hash";
import { superadmin } from "../page";
import { usernameQuery } from "@/queries/GetUserDetails";
import { GetOrderById } from "@/queries/GetOrders";
import { WithSSR, useCart } from "@/components/Cart/cart";

const salt = {
    "keyIndex": 1,
    "key": "3fc78cb4-ee13-4a66-8f6c-b50dda844eb0"
}

const RedirectCoupon = () => {
    const route = useRouter()
    const searchParams = useSearchParams()
    const trans = searchParams.get('trans')
    const order = searchParams.get('order')
    const ph = searchParams.get('ph')
    const encoded =     (order * 11111)
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
    const phone = ph && ph || token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-phone'] || ""
    // const totalAmt = typeof localStorage !== 'undefined' && localStorage?.getItem("totalAmt") || 0
    const userName = typeof localStorage !== 'undefined' && localStorage?.getItem("user_name") || 0
    const { data } = useQuery(usernameQuery, { variables: { "_eq": phone }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
    const { data: orderdetails } = useQuery(GetOrderById, { variables: { "id": order }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
    const product_id = orderdetails?.orders_by_pk?.order_products?.length > 0 && orderdetails?.orders_by_pk?.order_products[0]?.product_variant?.id || 0
    const product_name = orderdetails?.orders_by_pk?.order_products?.length > 0 && orderdetails?.orders_by_pk?.order_products[0]?.product_variant?.product?.name || 0
    const desc = `Your+order+number+${order}+of+amount+Rs.${orderdetails?.orders_by_pk?.amount || 0}+has+been+placed+successfully`


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

    const mailVariables = {
        "order_id": order.toString(),
        "email": data?.users?.length > 0 && data?.users[0]?.email,
        "order_link": `https://deals.extraa.in/od/${encoded}`
    }
    // console.log(data,'data', mailVariables);
    let rendercount = 0
    let count = 0
    let interval;
    const paymentCheck = async () => {
        // setCount((pre)=>pre+1)
        setLoad(true)
        // const headers = {
        //     "X-VERIFY": hash,
        //     "X-MERCHANT-ID": "EXTRAAONLINE"
        // }
        const variables = {
            "transaction_id": trans
        }
        let code = '#'
        const result = await PostAPI(`https://pay.extraa.in/payment-status`, variables)
        //  const result = ''
        code = result?.data?.code || code
        const items = {
            id: parseInt(trans),
            order_id: parseInt(order),
            status: code,
            // amount: parseFloat(orderdetails?.orders_by_pk?.amount)||0
        }
        //  console.log(desc,'data');
        const resp = await UsePaymentOrderTickets(items, client);

        if (code === 'BAD_REQUEST') {
            setErrorLabel(result?.data?.message || 'Error in your request please try again later...')
            setShowBtn(true)
        } else if (code === 'AUTHORIZATION_FAILED') {
            setErrorLabel(result?.data?.message || 'Authorization failed please try again later...')
            setShowBtn(true)
        } else if (code === 'INTERNAL_SERVER_ERROR') {
            setErrorLabel(result?.data?.message || 'Internal server error please try again later...')
            setShowBtn(true)
        } else if (code === 'TRANSACTION_NOT_FOUND') {
            setErrorLabel(result?.data?.message || 'Transaction not found please try again later...')
            setShowBtn(true)
        } else if (code === 'PAYMENT_ERROR') {
            setErrorLabel(result?.data?.message || 'Payment error please try again later...')
            setShowBtn(true)
        } else if (code === 'PAYMENT_PENDING') {
            count += 1
            if (count < 6) {
                setErrorLabel(result?.data?.message || 'Payment pending please wait...')
                setShowBtn(false)
                if (count === 1) {
                    interval = setInterval(async () => await paymentCheck(), 5000)
                }
            } else {
                setErrorLabel('Payment still in pending we will let you shortly...')
                setHomeShowBtn(true)
                clearInterval(interval);
            }
        } else if (code === 'PAYMENT_DECLINED') {
            setErrorLabel(result?.data?.message || 'Payment failed...')
            setShowBtn(true)
        } else if (code === 'TIMED_OUT') {
            setErrorLabel(result?.data?.message || 'Payment time out please try agian later...')
            setShowBtn(true)
        } else if (code === 'PAYMENT_SUCCESS' && rendercount === 0) {
            rendercount += 1
            // this for The Legacy Gala
            if (product_id == 1463 || product_id == 1464 || product_id == 1465 || product_id == 1457 || product_id == 1458 || product_id == 1459 || product_id == 1452 || product_id == 1455
                || product_id == 1456 || product_id == 1460 || product_id == 1461 || product_id == 1462
            ) {
                console.log("legacy");
                //     // whatsapp api
                await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=101915&authKey=S1IzRTNTUHN4cUJmUms0ZVpQYU5ZZz09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=${order}&var2=${product_name}&var3=${encoded} `)
                // normal msg api
                // await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=3&var1=${order}&var2=${product_name}&var3=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707172044332999319&country_code=91&customerMobile=${phone}`)
            } else {
                // whatsapp api
                await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=${order}&var2=${product_name}&var3=${encoded} `)
            }
            // normal msg api
            //  await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=1&var1=${order}&var2=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707170558637253609&country_code=91&customerMobile=${phone}&varCount=2`)
            // email api
            await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)
            // user coupon add api
            await PostAPI("https://wzputfojcxnmkpncb2dd25jihe0eovtp.lambda-url.ap-south-1.on.aws/", couponVariables)
            route.push(`/success/${order}`)
        } else if ("ERR_BAD_REQUEST") {
            setErrorLabel(result?.data?.message || 'Payment time out please try agian later...')
            setShowBtn(true)
        }

        setLoad(false)
        // console.log(result, 'res', count)
    }

    useEffect(() => {
        if (orderdetails && orderdetails?.order_status != 'PAYMENT_SUCCESS') {
            paymentCheck()
        }
    }, [orderdetails])

    return (
        <div className="h-[60vh] flex justify-center items-center">
            {load ?
                <div >

                    <Loader />
                    <div className="p-5">
                        <p className="gradient-text gradientAnimation text-center font-extrabold text-transparent text-lg md:text-2xl">Please Wait while we are processing your request...</p>
                        <p className="mt-5 text-center font-semibold">Please Do not press back button or refresh the page</p>
                    </div>


                </div>
                :
                <div className="flex flex-col h-[300px] items-center justify-center">
                    {/* <Loader /> */}
                    <h1>{errorLabel}</h1>
                    {showBtn && <SfButton size="sm" className="bg-extraa-blue" onClick={() => route?.push('/checkout')}>
                        Go back
                    </SfButton>
                    }
                    {showHomeBtn && <SfButton size="sm" className="bg-extraa-blue" onClick={() => route?.push('/')}>
                        Go home
                    </SfButton>
                    }
                </div>
            }
        </div>
    )
}

export default RedirectCoupon;