import { adminToken, userToken } from "@/app/page";
import { GetUserDetails } from "@/queries/GetUserDetails";

const { gql } = require("@apollo/client");

const updateQuery = gql`
mutation updateUser($id: bigint = "", $update: users_set_input = {age_range: "", dob: "", email: "", gender: "", name: ""}) {
  update_users(where: {id: {_eq: $id}}, _set: $update) {
    returning {
      id
    }
  }
}`

const insertAdd = gql`
mutation MyMutation($id: bigint = "", $age_range: String = "", $dob: date = "", $email: String = "", $gender: String = "", $name: String = "", $objects: [user_address_insert_input!] = {}) {
    update_users(where: {id: {_eq: $id}}, _set: {age_range: $age_range, dob: $dob, email: $email, gender: $gender, name: $name}) {
      returning {
        id
      }
    }
    insert_user_address(objects: $objects) {
      returning {
        id
      }
    }
  }
  `

export const UseUpdateUser = async (formData, client, user_id) => {
    let resp;
    try {
        let obj={          
            "id": user_id,
              "update": {
              "age_range": formData?.age,
              "email": formData?.email,
              "name": formData?.name,
              "gender": formData?.gender,
              "dob":formData?.date
              }
            
        }
    
        resp = await client.mutate({
            mutation:  updateQuery,
            refetchQueries: [GetUserDetails],
            variables: obj,
            context: {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`,
                },
            },
        });
        if (resp.errors) {
            return { success: false, error: resp.errors[0].message }
        }
    } catch (e) {
        console.log(e);
    }
    return { success: true, result: resp?.data }
}