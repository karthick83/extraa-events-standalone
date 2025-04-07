import { superadmin } from "@/app/page";

const { gql } = require("@apollo/client");


const token = typeof localStorage !== 'undefined' && localStorage.getItem('token');

const paymentQuery = gql`
mutation paymentStatus($order_status: String = "", $id: bigint = "", $order_id: bigint = "", $q_id: String = "", $card_details: jsonb = null, $amz_id: String = "", $metadata: jsonb = {}) {
  update_orders(where: {id: {_eq: $order_id}}, _set: {order_status: $order_status, q_id: $q_id, card_details: $card_details, amz_id: $amz_id}, _append: {metadata: $metadata}) {
    returning {
      id
      order_status
    }
  }
  update_order_transactions(where: {id: {_eq: $id}}, _set: {state: $order_status, order_id: $order_id}) {
    returning {
      state
      id
    }
  }
}
`
const paymentTicketQuery = gql`
mutation paymentStatus($order_status: String = "", $id: bigint = "", $order_id: bigint = "", $metadata: jsonb = {}) {
  update_orders(where: {id: {_eq: $order_id}}, _set: {order_status: $order_status}, _append: {metadata: $metadata}) {
    returning {
      id
      order_status
    }
  }
  update_order_transactions(where: {id: {_eq: $id}}, _set: {state: $order_status, order_id: $order_id}) {
    returning {
      state
      id
    }
  }
}
`

const UpdateOrder = gql`
mutation UpdateOrder($id: bigint = "", $_set: orders_set_input = {}) {
  update_orders_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
  }
}
`

export const UsePaymentOrder = async (cartItems, client) => {
  let resp;
  try {
    const variable = {
      "id": cartItems?.id,
      "order_id": cartItems?.order_id,
      "order_status": cartItems?.status,
      "q_id": cartItems?.q_id || null,
      "card_details": cartItems?.card_details,
      "amz_id": cartItems?.amz_id || null,
      "metadata": cartItems?.metadata || {}
      // "amount": parseFloat(cartItems?.amount)
    }
    resp = await client.mutate({
      mutation: paymentQuery,
      refetchQueries: [],
      variables: variable,
      context: {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || superadmin}`,
        },
      },
    });
    if (resp.errors) {
      return { success: false, error: resp.errors[0].message }
    }
  } catch (e) {
    console.log(JSON.stringify(e));
  }
  return { success: true, result: resp?.data }
}

export const UsePaymentOrderTickets = async (cartItems, client) => {
  let resp;
  try {
    const variable = {
      "id": cartItems?.id,
      "order_id": cartItems?.order_id,
      "order_status": cartItems?.status,
      // "q_id": cartItems?.q_id || null,
      // "card_details": cartItems?.card_details,
      // "amz_id": cartItems?.amz_id || null,
      "metadata": cartItems?.metadata || {}
      // "amount": parseFloat(cartItems?.amount)
    }
    resp = await client.mutate({
      mutation: paymentTicketQuery,
      refetchQueries: [],
      variables: variable,
      context: {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${superadmin}`,
        },
      },
    });
    if (resp.errors) {
      return { success: false, error: resp.errors[0].message }
    }
  } catch (e) {
    console.log(JSON.stringify(e));
  }
  return { success: true, result: resp?.data }
}


export const UseOrderUpdate = async (items, client) => {
  let resp;
  try {
    const variable = {
      "id": items?.id,
      "_set": items?.set,
      // "amount": parseFloat(cartItems?.amount)
    }
    resp = await client.mutate({
      mutation: UpdateOrder,
      refetchQueries: [],
      variables: variable,
      context: {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token || superadmin}`,
        },
      },
    });
    if (resp.errors) {
      return { success: false, error: resp.errors[0].message }
    }
  } catch (e) {
    console.log(JSON.stringify(e));
  }
  return { success: true, result: resp?.data }
}
