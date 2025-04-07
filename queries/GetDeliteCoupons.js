import { gql } from "@apollo/client";

const GetDeliteCoupons = gql`
query GetDeliteCoupons($where: coupons_bool_exp = {}, $user_id: bigint = "", $space_id: bigint = "") {
  coupons(where: $where) {
    brand_name
    id
    color
    code_type
    brand_logo
    industry_name
    offer_title
    offer_subtitle
  }
  delite_responses(where: {user_id: {_eq: $user_id}, space_id: {_eq: $space_id}}, limit: 1, order_by: {id: desc}) {
    id
    created_at
    outcome
  }
}

`;
export default GetDeliteCoupons;
