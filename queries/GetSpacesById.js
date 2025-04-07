import { gql } from "@apollo/client";

const GetSpaceById = gql`
query GetSpaceById($id: bigint = "") {
  spaces_by_pk(id: $id) {
    location
    details
    merchant_spaces {
      merchant {
        industry
      }
    }
  }
}
`;
export default GetSpaceById;
