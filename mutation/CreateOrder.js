import { adminToken } from "@/app/page";

const { gql } = require("@apollo/client");

const orderQuery = gql`
mutation CreateOrder($amount: numeric = "", $billing_address_id: bigint = "", $order_products: [order_products_insert_input!] = {}, $payment_method: String = "", $order_status: String = "", $payment_mode: String = "", $transaction_number: String = "", $user_id: bigint = "", $payment_complete: Int = 0, $discount_code: String = "", $metadata: jsonb = "", $tax_amount: numeric = "") {
    insert_orders_one(object: {amount: $amount, billing_address_id: $billing_address_id, order_products: {data: $order_products}, payment_method: $payment_method, order_status: $order_status, payment_mode: $payment_mode, transaction_number: $transaction_number, user_id: $user_id, payment_complete: $payment_complete, order_transactions: {data: {amount: $amount, state: "INTIATED"}}, discount_code: $discount_code, metadata: $metadata, tax_amount: $tax_amount}) {
      id
      order_status
      order_transactions {
        id
        amount
        state
        order_id
      }
    }
  }
`
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
export const UseCreateOrder = async (cartItems, client) => {
    let resp;
    try {
        const variable = {
            "amount": cartItems?.amount,
            "billing_address_id": cartItems?.billing_address_id,
            "order_products": cartItems?.order_products,
            "payment_mode": "",
            "payment_method": "",
            "order_status": cartItems?.order_status,
            "transaction_number": "",
            "user_id": cartItems?.user_id,
            "payment_complete": cartItems?.payment,
            "discount_code": cartItems?.discount_code,
            "tax_amount":cartItems.tax_amount,
            "metadata":cartItems?.metadata
        }
        resp = await client.mutate({
            mutation: orderQuery,
            refetchQueries: [],
            variables: variable,
            context: {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            },
        });
        if (resp.errors) {
            return { success: false, error: resp.errors[0].message }
        }
    } catch (e) {
        // console.log(JSON.stringify(e));
    }
    return { success: true, result: resp?.data }
}