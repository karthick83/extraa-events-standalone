import { gql } from "@apollo/client";

export const GetProducts = gql`
query GetProducts($order_by: [products_order_by!] = {}, $_or: [products_bool_exp!] = {}, $limit: Int = 30, $offset: Int = 0) {
  products(order_by: $order_by, where: {_or: $_or}, limit: $limit, offset: $offset) {
    id
    brand
    brand_logo
    name
    type
    slug
    active
    metadata
    category
    store_id
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
  products_aggregate(order_by: $order_by, where: {_or: $_or}) {
    aggregate {
      count
    }
  }
}

`;

export const GetAllProduct = gql`
query GetALLProducts {
  products {
    id
    brand
    name
    type
    category
    store_id
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
}
`
export const GetProductFilters = gql`
query GetProductFilters($type: Int_comparison_exp = {_is_null:false}) {
  categories: products(where: {active: {_eq: true}, type: $type}, distinct_on: category) {
    category
  }
  brands: products(where: {active: {_eq: true},type: $type}, distinct_on: brand) {
    brand
  }
}`
export const GetProductbyID = gql`
query getProductbyID($id: bigint = "") {
  products_by_pk(id: $id) {
    id
    brand
    brand_logo
    name
    type
    category
    images
    terms
    metadata
    store_id
    description
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
    coupon_id
    coupon {
      terms
      expiry_date
      location
    }
  }
}
`;

export const GetProductsBySlug = gql`
query getProductbySlug($slug: String = "") {
  products(where: {slug: {_eq: $slug}}) {
    id
    active
    brand
    brand_logo
    name
    type
    location
    category
    images
    coupon_id
    terms
    metadata
    description
    store_id
    product_variants {
      reg_price
      sale_price
      attributes
      id
      survey {
        id
        form_details
      }
      qr_id
    }
    coupon {
      terms
    }
  }
}
`

export const GetBrandImages = gql`
query GetBrandImages {
  coupons(where: {brand_logo: {_is_null: false}}, distinct_on: merchant_id, limit: 20) {
    id
    brand_logo
    brand_name
  }
}`
export const GetProductsBySearch = gql`
query GetProductsBySearch($_ilike: String = "", $order_by: [products_order_by!] = {}, $filters: [products_bool_exp!] = {}, $limit: Int = 10, $offset: Int = 0) {
  products(where: {_and: [{_or: [{name: {_ilike: $_ilike}}, {brand: {_ilike: $_ilike}}, {category: {_ilike: $_ilike}}, {description: {_ilike: $_ilike}}, {industry: {name: {_ilike: $_ilike}}}, {product_variants: {sku: {_ilike: $_ilike}, product: {brand: {_ilike: $_ilike}, name: {_ilike: $_ilike}, category: {_ilike: $_ilike}, description: {_ilike: $_ilike}}}}]}, {_or: $filters}, {active: {_eq: true}}]}, order_by: $order_by, limit: $limit, offset: $offset) {
    id
    slug
    brand
    brand_logo
    name
    metadata
    active
    type
    category
    store_id
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
  gift_cards(where:{ _or: [{name: {_ilike: $_ilike}}, {brand_name: {_ilike: $_ilike}}] }, limit:$limit, offset:$offset) {
    name
    images
    brand_name
    min_price
    max_price
    id
    product_id
    price
    slug
    sku
    extraa_images
    extraa_categories
  }
  gift_cards_aggregate(where:{ _or: [{name: {_ilike: $_ilike}}, {brand_name: {_ilike: $_ilike}}] }) {
    aggregate{
      count
    }
  }
  products_aggregate(where: {_and: [{_or: [{name: {_ilike: $_ilike}}, {brand: {_ilike: $_ilike}}, {category: {_ilike: $_ilike}}, {description: {_ilike: $_ilike}}, {industry: {name: {_ilike: $_ilike}}}, {product_variants: {sku: {_ilike: $_ilike}, product: {brand: {_ilike: $_ilike}, name: {_ilike: $_ilike}, category: {_ilike: $_ilike}, description: {_ilike: $_ilike}}}}]}, {_or: $filters}, {active: {_eq: true}}]}, order_by: $order_by) {
    aggregate {
      count
    }
  }
}`

export const goodiesQuery = gql`
query GetGoodiesProducts($order_by: [products_order_by!] = {}, $limit: Int = 20, $offset: Int = 0) {
  products(order_by: $order_by, where: {active: {_eq: true}, type: {_eq: 4}}, limit: $limit, offset: $offset) {
    id
    brand
    brand_logo
    name
    type
    slug
    active
    metadata
    store_id
    category
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
}
`

export const dealsQuery = gql`
query GetDealsProducts($limit: Int = 20, $offset: Int = 0, $order_by: [products_order_by!] = {id: desc}) {
  products(where: {active: {_eq: true}, type: {_eq: 1}}, limit: $limit, offset: $offset, order_by: $order_by) {
    id
    brand
    brand_logo
    name
    type
    slug
    active
    metadata
    category
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
}

`

export const ticketsQuery = gql`
query GetTicketsProducts($order_by: [products_order_by!] = {}, $limit: Int = 20, $offset: Int = 0) {
  products(order_by: $order_by, where: {active: {_eq: true}, type: {_eq: 2}}, limit: $limit, offset: $offset) {
    id
    brand
    brand_logo
    name
    type
    slug
    active
    metadata
    category
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
}
`
export const panIndiaQuery = gql`
query GetPanIndiaDealsProducts($order_by: [products_order_by!] = {}, $limit: Int = 20, $offset: Int = 0) {
  products(order_by: $order_by, where: {active: {_eq: true}, type: {_eq: 1}, location: {_eq: "PAN INDIA"}}, limit: $limit, offset: $offset) {
    id
    brand
    brand_logo
    name
    type
    slug
    active
    metadata
    category
    images(path: "[0]")
    product_variants {
      reg_price
      sale_price
      attributes
      id
    }
  }
}
`
