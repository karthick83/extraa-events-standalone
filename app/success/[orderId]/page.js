"use client"
import { SfButton, SfIconCheckCircle } from "@storefront-ui/react";
import OrderSummary from "@/components/orderSummary";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { getOrderDetailsQuery } from "@/queries/GetOrderDetails";
import { adminToken } from "@/app/page";
import { encode } from "@yag/id-hash";

export default function SuccessPageView({ params }) {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    const route = useRouter()
    const encoded = encode(params?.orderId * 11111)
    // const { data } = useQuery(getOrderDetailsQuery, { variables: { id: params?.orderId }, context: { headers: { Authorization: `Bearer ${token}` } } });
    // console.log(data, 'data');
    // const totalAmt = typeof localStorage !== "undefined" && JSON?.parse(localStorage?.getItem("totalPrice")) || 0
    const onHomeClick = () => {
        localStorage.removeItem("cart")
        localStorage.removeItem("totalPrice")
        localStorage.removeItem("totalAmt")
        localStorage.removeItem("cart_details")
        localStorage.removeItem("attendee_details")
        route.push(`/od/${encoded}`)
    }
    // const subTotal=data?.orders.length > 0 && data?.orders[0]?.order_products?.reduce(
    //     (acc, item) =>
    //       acc +
    //       ((item?.product_variant?.length > 0 &&
    //         item?.product_variant[0]?.sale_price) ||
    //         item?.product_variant?.sale_price) *
    //       item?.quantity,
    //     0
    //   ) || 0
    // const fees = parseFloat(parseFloat(subTotal) * 0.05) || 0;
    // const taxes = parseFloat(fees * 0.18) || 0;
    // const totalSum = parseFloat(parseFloat(subTotal) + fees + taxes).toFixed(2) || 0;
    // const roundAmt = Math.ceil(totalSum) - totalSum;
    // const resendConfirmation=async()=>{
    //     await AisensySendWhatsApp(name,phone,orderID,encoded)
    //     await GetAPI(`https://sms.extraa.in/SMSApi/send?userid=extraasms&password=123456&sendMethod=quick&mobile=${phone}&msg=Dear+Sir%2FMadam+Your+Order+%23${orderID}+has+confirmed.+Go+to+https%3A%2F%2Fdeals.extraa.in%2Fod%3Fkey=${encoded}+to+view+your+orders.+-+Team+Extraa&senderid=EXTAAA&msgType=text&dltEntityId=1201159947662865256&dltTemplateId=1707173174949380641&duplicatecheck=true&output=json`)
    //     await PostAPI('https://6tgvrplkxbg2bif6vrv5gxdofe0wrver.lambda-url.ap-south-1.on.aws/', mailVariables)

    // }
    return (
        <>
            <div className="md:flex md:flex-cols justify-center items-center  ">
                <div className="text-center m-3 max-w-lg min-h-[70vh] flex flex-col justify-center px-4 rounded-xl b-2">
                    <div className="flex items-start flex-col">
                        <h2 className="text-xl font-bold mb-3 w-full text-MFC-black">Your Order was placed Successfully</h2>
                        {/* {data?.orders.length > 0 && data?.orders[0]?.order_products?.map((i) => (
                            <div className="flex justify-between w-full gap-2" key={i.id}>
                                <div className="flex items-center flex-row gap-2">
                                    <label>{i?.product_variant?.product?.name}</label>
                                    <label>x</label>
                                    <label>{i?.quantity}</label>
                                </div>
                                <div className="flex text-center">
                                    <label>₹{i?.product_variant?.sale_price}</label>
                                </div>
                            </div>
                        ))} */}
                    </div>
                    <SfIconCheckCircle className="w-auto h-[65px] mt-5 mb-1.5 text-green-500" />

                    <h3 className=" mt-4 text-base font-bold mb-3 text-MFC-black">Order No: {params?.orderId}</h3>
                    <p className="text-sm font-semibold text-MFC-black">Note : You will get the order confirmation in your whatsApp and SMS.</p>
                    {/* <p className="text-sm font-semibold text-red-700 mt-8" onClick={()=>{resendConfirmation}}> Click here to Resend Order confirmation</p> */}

                    <div className="mb-3">
                        <SfButton className="bg-extraa-purple-btn  uc-sb min-w-[250px] mt-5" onClick={onHomeClick}>
                           <p className="text-Zoominfo-text-button"> View Details</p></SfButton>
                    </div>
                    {/* <div>
                        <SfButton variant="secondary" className="text-xs">Print recept</SfButton>
                    </div> */}
                </div>
                {/* <div className="px-3">
                    <OrderSummary
                        itemCount={data?.orders.length > 0 && data?.orders[0]?.order_products.length || 1}
                        type={1}
                        saleAmt={subTotal}
                        taxAmt={taxes}
                        DelvryAmt={fees}
                        roundamount={roundAmt}
                    />
                </div> */}
            </div>
        </>
    )
}