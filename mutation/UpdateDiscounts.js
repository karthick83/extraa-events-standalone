import { adminToken } from "@/app/page";

const { gql } = require("@apollo/client");

const discountQuery = gql`
mutation updateDiscounts($_eq: String = "", $remaining: Int = 10) {
    update_discounts(where: {code: {_eq: $_eq}}, _set: {remaining: $remaining}) {
      returning {
        remaining
        code
      }
    }
  }    
`
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export const UseDiscount = async (cartItems, client) => {
  let resp;
  try {
    const variable = {
      "_eq": cartItems?.code,
      "remaining": cartItems?.quantity,
    }
    resp = await client.mutate({
      mutation: discountQuery,
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
    console.log(JSON.stringify(e));
  }
  return { success: true, result: resp?.data }
}