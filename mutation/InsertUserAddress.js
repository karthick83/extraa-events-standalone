import { adminToken } from "@/app/page";
import { GetUserAddress } from "@/queries/GetUserAddress";
import { GetUserDetails } from "@/queries/GetUserDetails";

const { gql } = require("@apollo/client");
 
const insertAdd = gql`
mutation insertUserAddress($objects: [user_address_insert_input!] = {}) {
    insert_user_address(objects: $objects) {
      returning {
        id
        user_id
      }
    }
  }  
  `;
  export const editAdd = gql`
  mutation updateUserAddress(
    $id: bigint = "", 
    $address_line_1: String = "", 
    $address_line_2: String = "", 
    $city: String = "", 
    $full_name: String = "", 
    $landmark: String = "", 
    $phone_number: String = "", 
    $pincode: String = "", 
    $state: String = ""
  ) {
    update_user_address_by_pk(
      pk_columns: { id: $id }, 
      _set: {
        address_line_1: $address_line_1,
        address_line_2: $address_line_2,
        city: $city,
        full_name: $full_name,
        landmark: $landmark,
        phone_number: $phone_number,
        pincode: $pincode,
        state: $state
      }
    ) {
      id
    }
  }
`;


export const UseInsertUserAddress = async (cartItems, client, user_id, token) => {
    let resp;
    try {
        const obj={
            "address_line_1": cartItems?.address_1,
            "address_line_2": cartItems?.address_2 ||'',
            "pincode": cartItems?.zipCode,
            "landmark": cartItems?.landmark ||'',
            "city": cartItems?.city,
            "state": cartItems?.state,
            "phone_number":cartItems?.phone,
            "full_name":cartItems?.name,
            "user_id": parseInt(user_id)
        }
        resp = await client.mutate({
            mutation: insertAdd,
            refetchQueries: [GetUserDetails],
            variables: {
                "objects":[obj]
            },
            context: {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
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
export const userEditAddress = async (cartItems, client, editId, token) => {
  let resp;
  try {
      const obj={
          "id":parseInt(editId),
          "address_line_1": cartItems?.address_1,
          "address_line_2": cartItems?.address_2 ||'',
          "pincode": cartItems?.zipCode,
          "landmark": cartItems?.landmark ||'',
          "city": cartItems?.city,
          "state": cartItems?.state,
          "phone_number":cartItems?.phone,
          "full_name":cartItems?.name,
          // "user_id": parseInt(user_id)
      }
      resp = await client.mutate({
          mutation: editAdd,
          refetchQueries: [GetUserAddress],
          variables:obj
          ,
          context: {
              headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`,
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