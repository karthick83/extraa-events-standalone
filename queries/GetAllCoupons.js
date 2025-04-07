import { gql } from "@apollo/client";

const GetAllCoupons = gql`
query GetCoupons($limit: Int, $offset: Int = 10, $_or: [coupons_bool_exp!] = {}) {
  user_coupons(order_by: {id: desc}, limit: $limit, offset: $offset, where: {coupon: {_or: $_or}}) {
    coupon_code
    id
    created_at
    coupon {
      brand_logo
      brand_name
      terms
      status
      offer_type
      offer_title
      offer_subtitle
      name
      mode
      merchant_id
      location
      industry
      industry_name
      id
      expiry_date
      coupon_code
      color
      code_type
    }
    redeemed
  }
  user_coupons_aggregate {
    aggregate {
      count
    }
  }
}
`;
export default GetAllCoupons;
