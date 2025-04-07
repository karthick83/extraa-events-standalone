"use client"
import TicketsOrderDetails from "@/components/TicketsOrderDetails";

import { GetOrderById } from "@/queries/GetOrders";
import { useQuery } from "@apollo/client";
import { superadmin } from "../page";
import { decode } from "@yag/id-hash";
import Loader from "@/components/loader";
// import GiftCardDetails from "@/app/giftcard/[giftUrl]/page";
import GiftCardOrderDetails from "@/components/GiftCardOrderDetails";
import { useEffect, useState } from "react";



const OrderDetails = ({ params }) => {
    const [orderId, setOrderId] = useState(null);
    let urlQuerryParams;
    useEffect(() => {
        if (typeof window !== 'undefined') {
          const search = window.location.search;
          urlQuerryParams = new URLSearchParams(search);
          const foo = urlQuerryParams.get('key');
          const decodedOrderId = decode(foo) / 11111;
          setOrderId(decodedOrderId);
        }
      }, []);

// console.log(foo,"paramsSearch");

   
    const token = superadmin;
    const { data, loading } = useQuery(GetOrderById, {skip: !orderId, variables: { id: orderId }, context: { headers: { Authorization: `Bearer ${token}` } } });
    const orderDetails = data?.orders_by_pk;
    const orderType = orderDetails?.order_products?.map((item, index) => (item?.product_variant?.product?.type
    ))
    // console.log(orderDetails, 'order details');
    const product_type = orderDetails?.metadata?.product_items?.filter(x => x === 'tickets')||[]

    return (

        <>
            {product_type?.length === 0 &&
                <GiftCardOrderDetails
                    params={urlQuerryParams}
                    orderId={orderId}
                    loading={loading}
                    orderDetails={orderDetails}
                />
            }{
                product_type?.length > 0 &&
                <TicketsOrderDetails
                    params={urlQuerryParams}
                    orderId={orderId}
                    loading={loading}
                    orderDetails={orderDetails}
                />}
        </>

    )
}

export default OrderDetails;