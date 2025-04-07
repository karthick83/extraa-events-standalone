import { PostAPI } from "./postApi"


export async function getOTP(num, email) {
    // headers.append("Content-Type", "application/json");
    const url = 'https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/get-otp'
    const variables = { "phone_number": num, "email":email||false }
    const headers = {
        "Content-Type": "application/json"
    }
    const response = await PostAPI(url, variables, headers)
    return response?.data
}

export async function verifyOTP(otp, otp_id, user_id) {
    const variables = {
        otp: otp,
        id: otp_id,
        user_id: user_id,
    }
    const url = "https://faas-blr1-8177d592.doserverless.co/api/v1/web/fn-5eb492b6-735e-4a32-8582-c80db698fb7e/user/verify-otp"
    const headers = {
        "Content-Type": "application/json"
    }
    const response = await PostAPI(url, variables, headers)
    return response?.data
}