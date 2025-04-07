import { gql } from "@apollo/client";

export const UserSignUp = gql`
  mutation UpdateUserDetials(
    $id: bigint = ""
    $name: String = ""
    $gender: String = ""
    $age_range: String = ""
    $email: String = ""
  ) {
    update_users_by_pk(
      pk_columns: { id: $id }
      _set: { name: $name, gender: $gender, age_range: $age_range, email:$email }
    ) {
      name
    }
  }
`;