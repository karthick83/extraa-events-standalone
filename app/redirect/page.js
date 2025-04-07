"use client";
import { GetAPI, PostAPI } from "@/api/postApi";
import Loader from "@/components/loader";
import { UsePaymentOrder } from "@/mutation/UpdatePaymentStatus";
import { useApolloClient, useQuery } from "@apollo/client";
import { SfButton } from "@storefront-ui/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { decodeJWT } from "../checkout/page";
import { encode } from "@yag/id-hash";
import { superadmin } from "../page";
import { usernameQuery } from "@/queries/GetUserDetails";
import { GetOrderById } from "@/queries/GetOrders";
import AES from "crypto-js/aes";
import axios from "axios";
import NotificationManager from "@/components/NotificationManager";
import { WithSSR, useCart } from "@/components/Cart/cart";
import { UseWalletTrans } from "@/queries/GetWallertTrans";
import { enc } from "crypto-js";
import { decodeAndDecrypt } from "@/common/encryptDecryptFunc";


const Redirect = () => {
    const route = useRouter()
    const searchParams = useSearchParams()
    const encodedTransID=searchParams.get('coin_trans')
    const encodedOrderID=searchParams.get('order')
    const trans = searchParams.get('trans')
    const coin_trans = decodeAndDecrypt(encodedTransID,"20aserasecretkey24")
    const order = decodeAndDecrypt(encodedOrderID,"20aserasecretkey24")
    console.log(order,"orderID Redirect page");
    const ph = searchParams.get('ph')
    const encoded = encode(order * 11111)
    // const orderId = decode(encoded) /11111
    const client = useApolloClient()
    const [errorLabel, setErrorLabel] = useState('Please wait we will redirect you...')
    const [showBtn, setShowBtn] = useState(false)
    const [showHomeBtn, setHomeShowBtn] = useState(false)
    const [load, setLoad] = useState(false)


    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const phone = ph && ph || token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-phone'] || ""

    const userName = typeof localStorage !== 'undefined' && localStorage?.getItem("user_name") || 0
    const userid = token && token !== 'undefined' && decodeJWT(token)['https://hasura.io/jwt/claims']['x-hasura-user-id']
    const { data } = useQuery(usernameQuery, { variables: { "_eq": phone }, context: { headers: { Authorization: `Bearer ${superadmin}` } } })
    const { data: orderData } = useQuery(GetOrderById, { variables: { "id": order }, context: { headers: { Authorization: `Bearer ${token || superadmin}` } } })
    const orderDetails = orderData?.orders_by_pk;
    const desc = `Your+order+number+${order}+of+amount+Rs.${orderDetails?.amount || 0}+has+been+placed+successfully`
    // const cartitems = typeof localStorage !== 'undefined' && JSON?.parse(localStorage?.getItem("cart_items")) || []
    const [notifications, setNotifications] = useState(false)
    const cart = WithSSR(useCart, (state) => state);
    const cartitems = cart?.cartItems || 0;

    const couponVariables = {
        "objects": Array.isArray(cartitems)
            ? cartitems
                .filter(item => item?.coupon_id) // Filter out items where coupon_id exists
                .map(item => ({
                    "coupons_id": item?.coupon_id,
                    "user_id": userid
                }))
            : []
    };
    // console.log(couponVariables, "Coupons:");

    const mailVariables = {
        "order_id": order?.toString(),
        "email": data?.users?.length > 0 && data?.users[0]?.email,
        "order_link": `https://deals.extraa.in/od/${encoded}`
    }

    // console.log(data,'data', mailVariables);
    let count = 0
    let interval;



    async function paymentCheck() {
        let code = ''
        if (trans) {
            const variables = {
                "transaction_id": trans
            }
            const result = await PostAPI(`https://pay.extraa.in/payment-status`, variables);
            code = result?.data?.code;
        } else {
            const res = await UseWalletTrans(coin_trans)
            // console.log(res, 'Payment Check');
            if (userid == res?.data?.walletBySenderWalletNumber?.user_id) {
                code = "PAYMENT_SUCCESS"
            }
        }
        // console.log(code, 'code');
        checkGiftOrder(code);
    }

    async function checkGiftOrder(status) {
        let q_id, cardDetails,amz_id;
        let newStatus = status;

        const giftCardProducts = orderDetails?.order_products?.filter(product =>
            product?.giftcard_id && product?.giftcard_denom
        );
        let amazonGiftCards = giftCardProducts?.filter(product => product.sku === 'EGCGBASERA001' || product.sku === 'EGCGBASERA002' || product.sku === 'EGCGBASERA003');
        let normalGiftCards = giftCardProducts?.filter(product => product.sku !== 'EGCGBASERA001' && product.sku !== 'EGCGBASERA002' && product.sku !== 'EGCGBASERA003');
        // console.log(giftCardProducts, "gfPoru");

        if (status === 'PAYMENT_SUCCESS' && giftCardProducts?.length > 0) {
            const productQuantity = Array.isArray(giftCardProducts) && giftCardProducts?.reduce((acc, item) => acc + item?.quantity, 0);
            const giftVars = {
                "syncOnly": productQuantity <= 4,
                "deliveryMode": 'API',
                "address": {
                    "firstname": data?.users?.length > 0 && data?.users[0]?.name,
                    "email": data?.users?.length > 0 && data?.users[0]?.email,
                    "telephone": `+91${phone}`,
                    "country": "IN",
                    "postcode": data?.users?.length > 0 && data?.users[0]?.user_addresses[0]?.pincode || '600017',
                    "billToThis": true
                },
                "payments": [
                    {
                        "code": "svc",
                        "amount": Array.isArray(normalGiftCards) && normalGiftCards?.reduce((acc, item) => acc + (item?.quantity * item?.giftcard_denom), 0),
                        "poNumber": `exPO1${order}`
                    }
                ],
                "products": Array.isArray(normalGiftCards) && normalGiftCards?.map((i) => {
                    return {
                        "sku": i?.sku,
                        "price": i?.giftcard_denom,
                        "qty": i?.quantity,
                        "currency": 356,
                        "giftMessage": ""
                    }
                }),
                "amz_payments": [
                    {
                        "code": "svc",
                        "amount": Array.isArray(amazonGiftCards) && amazonGiftCards?.reduce((acc, item) => acc + (item?.quantity * item?.giftcard_denom), 0),
                        "poNumber": `exPO1${order}`
                    }
                ],
                "amz_products": Array.isArray(amazonGiftCards) && amazonGiftCards?.map((i) => {
                    return {
                        "sku": i?.sku,
                        "price": i?.giftcard_denom,
                        "qty": i?.quantity,
                        "currency": 356,
                        "giftMessage": ""
                    }
                }),
                "refno": `extraa${order}-${trans||"w"+coin_trans}`

            }

            try {
                // Make a POST request using Axios
                const response = await axios.post('https://gapi.extraa.in/create-order/', giftVars, { timeout: 10000 });
                // console.log(response,'create');
                // Extract the order ID from the response and update the state
                if(amazonGiftCards?.length>0){
                    amz_id=response?.data?.amz_details?.orderId
                }
                q_id = response?.data?.orderId;
                if (giftVars.syncOnly) {
                    const responseEncrypted = AES.encrypt(
                        JSON.stringify(response?.data),
                        "20aserasecretkey24"
                    ).toString();
                    cardDetails = [responseEncrypted];
                }
                else {
                    //Order is still processing 
                    let attempt = 1;
                    const maxAttempts = 4;
                    const retryInterval = 40000; // 40 seconds
                    // Status check loop
                    while (attempt <= maxAttempts) {
                        // console.log(attempt);
                        await new Promise(resolve => setTimeout(resolve, retryInterval));

                        try {
                            const statusResponse = await axios.get(`https://gapi.extraa.in/get-order-status/extraa${order}-${trans}`);
                            const status = statusResponse?.data?.status;
                            const statusLabel = statusResponse?.data?.statusLabel;
                            console.log(statusResponse,'status');
                            if (statusResponse && status && status === 'COMPLETE') {
                                q_id = statusResponse?.data?.orderId;
                                break;
                            }
                            if (statusLabel === "Initiate Cancel Activation" || statusLabel === "Activation Failed") {
                                newStatus = 'ORDER_FAILED';
                                break; // Exit the loop 

                            }
                            // Retry after a certain interval
                            attempt++;

                        } catch (error) {
                            if (error?.message) {
                                try {
                                    const revResponse = await axios.post('https://gapi.extraa.in/reverse-order/', giftVars);
                                    q_id = revResponse.data?.order?.orderId;
                                    newStatus = 'ORDER_FAILED';
                                    break; // Exit the loop if successful

                                } catch (err) {
                                    newStatus = 'ORDER_FAILED';
                                    break; // Exit the loop if successful
                                }
                            }
                        }

                    }

                    // console.log("Timed out");
                    if (!q_id) {
                        try {
                            const revResponse = await axios.post('https://gapi.extraa.in/reverse-order/', giftVars);
                            q_id = revResponse.data?.order?.orderId;
                            newStatus = 'ORDER_FAILED';

                        } catch (err) {
                            newStatus = 'ORDER_FAILED';
                        }
                    } else {
                        try {
                            // Make a POST request using Axios
                            const response = await axios.get(`https://gapi.extraa.in/get-card/${q_id}`);
                            const responseEncrypted = AES.encrypt(
                                JSON.stringify(response?.data),
                                "20aserasecretkey24"
                            ).toString();
                            cardDetails = [responseEncrypted];
                        } catch (error) {
                            // Handle errors
                            console.error('Error creating order:', error);
                        }
                    }


                }


            } catch (error) {
                if (error?.message) {
                    // Timeout
                    let attempt = 1;
                    const maxAttempts = 3;
                    const retryInterval = 40000; // 40 seconds

                    // Status check loop
                    while (attempt <= maxAttempts) {
                        // console.log(attempt);
                        try {
                            const statusResponse = await axios.get(`https://gapi.extraa.in/get-order-status/extraa${order}-${trans}`);
                            const status = statusResponse?.data?.status;
                            const statusLabel = statusResponse?.data?.statusLabel;

                            if (statusResponse && status && status === 'COMPLETE') {
                                q_id = statusResponse?.data?.orderId;
                                break;
                            }
                            if (statusLabel === "Initiate Cancel Activation" || statusLabel === "Activation Failed" || status == 'CANCELED') {
                                newStatus = 'ORDER_FAILED';
                                break; // Exit the loop 

                            }

                            attempt++;

                        } catch (error) {
                            if (error?.message) {
                                try {
                                    const revResponse = await axios.post('https://gapi.extraa.in/reverse-order/', giftVars);
                                    q_id = revResponse.data?.order?.orderId;
                                    newStatus = 'ORDER_FAILED';
                                    break; // Exit the loop if successful

                                } catch (err) {
                                    newStatus = 'ORDER_FAILED';
                                    break; // Exit the loop if successful
                                }
                            }
                        }
                        await new Promise(resolve => setTimeout(resolve, retryInterval));

                    }
                    if (!q_id) {
                        newStatus = 'ORDER_FAILED';
                    }
                }
                // Handle errors
                console.error('Error creating order:', error);
            }
        }
        updateOrder({
            id: parseInt(trans)||4,
            order_id: parseInt(order),
            status: newStatus,
            q_id: q_id,
            card_details: cardDetails,
            amz_id:amz_id
        });
    }


    async function updateOrder(items) {
        const response = await UsePaymentOrder(items, client);

        if (items.status === 'BAD_REQUEST') {
            setErrorLabel('Error in your request please try again later...')
            setShowBtn(true)
        } else if (items.status === 'AUTHORIZATION_FAILED') {
            setErrorLabel('Authorization failed please try again later...')
            setShowBtn(true)
        } else if (items.status === 'INTERNAL_SERVER_ERROR') {
            setErrorLabel('Internal server error please try again later...')
            setShowBtn(true)
        } else if (items.status === 'TRANSACTION_NOT_FOUND') {
            setErrorLabel('Transaction not found please try again later...')
            setShowBtn(true)
        } else if (items.status === 'PAYMENT_ERROR') {
            setErrorLabel('Payment error please try again later...')
            setShowBtn(true)
        } else if (items.status === 'PAYMENT_PENDING') {
            count += 1
            if (count < 6) {
                setErrorLabel('Payment pending please wait...')
                setShowBtn(false)
                if (count === 1) {
                    interval = setInterval(async () => await paymentCheck(), 5000)
                }
            } else {
                setErrorLabel('Payment still in pending we will let you shortly...')
                setHomeShowBtn(true)
                clearInterval(interval);
            }
        } else if (items.status === 'PAYMENT_DECLINED') {
            setErrorLabel('Payment failed...')
            setShowBtn(true)
        } else if (items.status === 'TIMED_OUT') {
            setErrorLabel('Payment time out please try agian later...')
            setShowBtn(true)
        } else if (items.status === 'ORDER_FAILED') {
            setErrorLabel("Sorry, we couldn't place your order. Refund has been requested")
            setShowBtn(true)
        } else if (items.status === 'PAYMENT_SUCCESS') {

            // console.log(resp);  
            // await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=2&waTemplateName=deals_confirmation&waTemplateLang=en&country_code=91&customerMobile=${phone}&varCount=3&var1=${userName || 'Customer'}&var2=${desc || ''}&var3=https://deals.extraa.in/od/${encoded} `)
            await GetAPI(`https://api.growaasan.com/api/sendPosCommunication?varCount=1&var1=${order}&var2=${encoded}&clietnId=100365&authKey=Q0ptUDJ1dTlzZFYrd0RMUFR6aU5OUT09&communicationType=1&smsTemplateId=1707170558637253609&country_code=91&customerMobile=${phone}&varCount=2`)
            // email api
            await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)

            // user coupon add api
            couponVariables?.objects?.length > 0 && await PostAPI("https://wzputfojcxnmkpncb2dd25jihe0eovtp.lambda-url.ap-south-1.on.aws/", couponVariables)

            route.push(`/success/${order}`);
        } else if ("ERR_BAD_REQUEST") {

            setErrorLabel('Payment time out please try agian later...')
            setShowBtn(true)
        }
        setLoad(false);
    }


    useEffect(() => {

        if (orderDetails && !orderDetails?.q_id && orderDetails?.order_status != 'PAYMENT_SUCCESS' && orderDetails?.order_status != 'ORDER_FAILED') {
            setLoad(true);
            paymentCheck();
        } else if (orderDetails?.order_status == 'ORDER_FAILED') {
            setErrorLabel("Sorry, we couldn't place your order. Refund has been requested")
            setShowBtn(true);
        }
    }, [orderDetails])

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    const handleBeforeUnload = (e) => {
        e.preventDefault();
        const message =
            "Are you sure you want to leave? All provided data will be lost.";
        e.returnValue = message;
        return message;
    };
//     //Function to decode Base64 URL
//     const base64UrlDecode = (data) => {
//         data = data.replace(/-/g, '+').replace(/_/g, '/');
//         while (data.length % 4) {
//           data += '=';
//         }
//         return data;
//       };
//       // Decode and decrypt function
// const decodeAndDecrypt = (encodedText, secretKey) => {
//     const base64Decoded = CryptoJS.enc.Base64.parse(base64UrlDecode(encodedText)).toString(CryptoJS.enc.Utf8);
//     const decrypted = CryptoJS.AES.decrypt(base64Decoded, secretKey);
//     return decrypted.toString(CryptoJS.enc.Utf8);
//   };
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
                    <p className="my-8 uc-sb text-lg mx-8 text-center">{errorLabel}</p>
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
            {notifications && <NotificationManager message={message} alertType={0} offset={1} />}

        </div>
    )
}

export default Redirect;