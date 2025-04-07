const { gql } = require("@apollo/client");
export const GetUserAddress=gql`
query GetUserAddress {
  user_address {
    address_line_1
    address_line_2
    city
    full_name
    id
    landmark
    phone_number
    pincode
    state
  }
}`