const { gql } = require("@apollo/client");

export const getOrderDetailsQuery=gql`
query orderDetails($id: bigint = "") {
    orders(where: {id: {_eq: $id}}) {
      id
      amount
      created_at
      order_status
      order_products {
        id
        product_variant {
          id
          product {
            brand
            id
            name
          }
          sale_price
        }
        quantity
      }
    }
  }  
`