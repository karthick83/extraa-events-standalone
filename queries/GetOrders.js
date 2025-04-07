import { gql } from "@apollo/client";

export const UserOrdersQuery = gql`
query userOrders($id: bigint = "", $limit: Int = 5, $offset: Int = 0) {
  orders(where: {user_id: {_eq: $id}, order_status: {_eq: "PAYMENT_SUCCESS"}}, order_by: {id: desc}, limit: $limit, offset: $offset) {
    amount
    created_at
    id
    card_details
    order_transactions {
      id
    }
    order_products {
      quantity
      sku
      product_variant {
        product {
          brand
          category
          images
          name
        }
        reg_price
        sale_price
        sku
      }
    }
    order_status
    payment_complete
    payment_method
    tax_amount
    metadata    
    q_id
    card_details
  }
  
  orders_aggregate(where: {user_id: {_eq: $id}, order_status: {_eq: "PAYMENT_SUCCESS"}}) {
    aggregate {
      count
    }
  }
  
}
  `;

export const GetOrderById = gql`
query GetOrderById($id: bigint = 0) {
  orders_by_pk(id: $id) {
    amount
    created_at
    id
    discount_code
    q_id
    amz_id
    card_details
    metadata
    shipping_status
    order_products {
      id
      quantity
      giftcard_id
      giftcard_denom
      sku
      redeemed_orders_aggregate {
        aggregate {
          sum {
            quantity
          }
        }
      }
      product_variant {
      id
        qr {
          qr_coupons {
            coupon {
              brand_logo
              offer_subtitle
              offer_title
            }
          }
        }
        product {
          name
          brand
          category
          images(path: "[0]")
          id
          type
          metadata
          coupon_id
          brand_logo
          
        }
        attributes
        sale_price
        sku
      }
    }
    order_status
    order_transactions {
      id
      state
}
}
}`