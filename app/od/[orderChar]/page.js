"use client"
import TicketsOrderDetails from "@/components/TicketsOrderDetails";

import { GetOrderById } from "@/queries/GetOrders";
import { useQuery } from "@apollo/client";
import { superadmin } from "../../page";
import { decode } from "@yag/id-hash";
import Loader from "@/components/loader";
// import GiftCardDetails from "@/app/giftcard/[giftUrl]/page";
import GiftCardOrderDetails from "@/components/GiftCardOrderDetails";
import { useEffect } from "react";



const OrderDetails = ({ params }) => {
    const orderId = decode(params?.orderChar) / 11111;
    console.log(params,"params")
    const token = superadmin;
    const { data, loading } = useQuery(GetOrderById, { variables: { id: orderId }, context: { headers: { Authorization: `Bearer ${token}` } } });
    const orderDetails = data?.orders_by_pk;
    const orderType = orderDetails?.order_products?.map((item, index) => (item?.product_variant?.product?.type
    ))
    // console.log(orderDetails, 'order details');
    const product_type = orderDetails?.metadata?.product_items?.filter(x => x === 'tickets')||[]

    return (

        <>
            {product_type?.length === 0 &&
                <GiftCardOrderDetails
                    params={params}
                    orderId={orderId}
                    loading={loading}
                    orderDetails={orderDetails}
                />
            }{
                product_type?.length > 0 &&
                <TicketsOrderDetails
                    params={params}
                    orderId={orderId}
                    loading={loading}
                    orderDetails={orderDetails}
                />}
        </>

    )
}

export default OrderDetails;