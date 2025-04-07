import { gql } from "@apollo/client";
import { client } from "@/app/layout";

const GetWalletTrans = gql`
query getTrans($id: bigint = "") {
  wallet_transactions_by_pk(id: $id) {
    amount
    id
    walletBySenderWalletNumber {
      id
      user_id
    }
  }
}   
`;

const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;

export async function UseWalletTrans(id) {
    // console.log(today, lastSeventhDay,'data')
    const { data, loading, refetch, error } = await client.query({
        query: GetWalletTrans,
        variables: {
            "id": id
        },
        context: { headers: { Authorization: `Bearer ${token}` } }
    })
    return await {
        refetch,
        loadingG: loading,
        data: data?.wallet_transactions_by_pk || {},
    };
}
export const getWalletTransactions= gql`query getWalletTransactions($limit: Int = 10, $offset: Int = 10) {
  wallet_transactions(order_by: {id: desc}, limit: $limit, offset: $offset) {
    id
    amount
    receiver_wallet_number
    sender_wallet_number
    created_at
    coin {
      name
      id
      wallets {
        balance
      }
    }
    
    wallet {
      merchant {
        id
        name
      }
      user {
        id
        name
      }
      balance
    }
    walletBySenderWalletNumber {
      user {
        id
        name
      }
      merchant {
        id
        name
      }
    }
    order {
      order_products {
        product_variant {
          product {
            images
            id
            name
          }
        }
      }
    }
  }
  wallet_transactions_aggregate {
    aggregate {
      count
    }
  }
}
`