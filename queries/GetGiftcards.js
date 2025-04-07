import { gql } from "@apollo/client";

export const GetGiftCardsList = gql`
query GetGiftCardsList($limit: Int = 10, $offset: Int = 0, $_or: [gift_cards_bool_exp!] = {}, $order_by: [gift_cards_order_by!] = {}) {
  gift_cards(limit: $limit, offset: $offset, where: {_or: $_or}, order_by: $order_by) {
    id
    name
    brand_name
    sku
    images
    price
    min_price
    max_price
    slug
    product_id
    extraa_images
    extraa_categories
  }
  gift_cards_aggregate(where: {_or: $_or}) {
    aggregate {
      count
    }
  }
}
`;

export const GetHomePagGiftCards=gql`
query GetGiftCardsForHomePage($where: gift_cards_bool_exp = {}) {
  gift_cards(limit: 10, where: $where) {
    brand_name
    product_id
    name
    price
    sku
    slug
    min_price
    max_price
    id
    images
    extraa_images
    extraa_categories
  }
}`

export const GetGiftCardBySlug = gql`
query GetGiftCardBySlug($_eq: String = "") {
  gift_cards(where: {slug: {_eq: $_eq}}) {
    product_id
    description
    name
    tnc
    brand_name
    categories
    eta_message
    expiry
    handling_charges
    images
    kyc_enabled
    price
    related_products
    sku
  }
}
`;
export const GetGiftCardPage=gql`
query GetGiftCardList($limit: Int = 10, $offset: Int = 0, $_or: [gift_cards_bool_exp!] = {}, $order_by: [gift_cards_order_by!] = {}) {
  gift_cards(limit: $limit, offset: $offset, where: {_or: $_or}, order_by: $order_by) {
    id
    brand_name
    name
    product_id
    min_price
    max_price
    images
    slug
    sku
  }
}`
export const GetGiftCardFilters=gql`
query GetGiftCardFilters {
  brands:gift_cards(distinct_on: brand_name) {
    brand_name
  }
}`