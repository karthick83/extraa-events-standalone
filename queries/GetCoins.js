import { gql } from "@apollo/client";
import { client } from "@/app/layout";

const GetAllCoins = gql`
query getCoins {
  coins(where: {store_id: {_eq: 2}}) {
    cost
    icon
    id
    name
    wallets {
      balance
    }
  }
}
`;

const GetCoinsById = gql`
query GetUserWallet($where: wallet_bool_exp = {}) {
  wallet(where: $where) {
    balance
    coin_type
    id
    coin {
      id
      cost
    }
  }
}
`

const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export async function UseWalletBalance(value) {
  // console.log(today, lastSeventhDay,'data')
  const val = value?.map(i => ({ "coin_type": { "_eq": i } }));
  const { data, loading, refetch, error } = await client.query({
    query: GetCoinsById,
    variables: {
      "where": { "_or": val }
    },
    context: { headers: { Authorization: `Bearer ${token}` } }
  })
  return await {
    refetch,
    loadingG: loading,
    data: data?.wallet || [],
  };
}
export default GetAllCoins;
