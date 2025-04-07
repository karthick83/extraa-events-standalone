"use client";

import { GetOrderById } from "@/queries/GetOrders";
import { useQuery } from "@apollo/client";
import GiftCardOrderDetails from "@/components/GiftCardOrderDetails";
import TicketsOrderDetails from "@/components/TicketsOrderDetails";

// param.dealsId
const OrderDetails = ({ params }) => {
  const orderId = params?.orderId;
  const token =
    typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
  const { data, loading } = useQuery(GetOrderById, {
    variables: { id: params?.orderId },
    context: { headers: { Authorization: `Bearer ${token}` } },
  });
  const orderDetails = data?.orders_by_pk;


  return (
    <>
      {orderDetails?.q_id ?
        <GiftCardOrderDetails
          params={params}
          orderId={orderId}
          loading={loading}
          orderDetails={orderDetails}
        />
        :
        <TicketsOrderDetails
          params={params}
          orderId={orderId}
          loading={loading}
          orderDetails={orderDetails}
        />}
    </>

  );
};
export default OrderDetails;
