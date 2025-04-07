import { client } from "@/app/layout";
import { adminToken } from "@/app/page";
import { gql, useQuery } from "@apollo/client";

const getPromoQuery = gql`
query getPromoCode($code: String = "") {
    discounts(where: {code: {_eq: $code}}) {
      amount
      remaining
      type
      message
      name
      id
      code
    }
  } 
`
const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export default async function UsePromoCode(code) {
    // console.log(today, lastSeventhDay,'data')
    const { data, loading, refetch, error } = await client.query({
        query: getPromoQuery,
        variables: {
            "code": code
        },
        context: { headers: { Authorization: `Bearer ${token}` } }
    })
    return await {
        refetch,
        loadingG: loading,
        data: data || [],
    };
} 