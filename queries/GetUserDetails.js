const { gql } = require("@apollo/client");

export const GetUserDetails = gql`
query userDetails($id: bigint = "") {
    users_by_pk(id: $id) {
      name
      phone_number
      email
      dob
      gender
      age_range
      user_addresses {
        id
        address_line_1
        address_line_2
        city
        pincode
        state
        location
        landmark
      }
    }
  }  
`

export const usernameQuery = gql`
query username($_eq: String = "") {
  users(where: {phone_number: {_eq: $_eq}}) {
    id
    name
    email
     user_addresses {
      pincode
     }
  }
}
`