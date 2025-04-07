import axios from "axios";

export const PostAPI=async(url, variables, headers)=>{
 const result= await axios.post(url, variables,  {
    headers:headers
  })
  .then((resp) => {
      return resp
  })
  .catch((error) => {
      return error
  })
  return result
}

export const GetAPI=async(url, headers)=>{
  const resp= await axios.get(url, { headers})
  .then((resp)=>{
    return resp
  })
  .catch((err)=>{
    return err
  })
  return resp
}

export const AisensySendWhatsApp = async  (name, num,orderId,encode)=>{
  const endPoint = 'https://backend.aisensy.com/campaign/t1/api/v2';
  console.log(orderId,'entered');
  
  let templateParams=[];
  templateParams.push(orderId.toString());
  templateParams.push(encode.toString());
const payload = {
 apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZTgyMjI0NTk4YTRkMGI3MjMyNTJmNCIsIm5hbWUiOiJBc2VyYSBUZWNobm9sb2dpZXMgMzAwNSIsImFwcE5hbWUiOiJBaVNlbnN5IiwiY2xpZW50SWQiOiI2NmU4MjIxNTU5OGE0ZDBiNzIzMjUwYzUiLCJhY3RpdmVQbGFuIjoiQkFTSUNfTU9OVEhMWSIsImlhdCI6MTcyNjQ4OTEyNH0.NAG2sW-r7WEmtas5l4Lx8ilmkD_HOnxHqtP7QCkIyVM",
 campaignName: "zoominfoOrderConfirmation",
 destination: num,
 userName: name,
 templateParams
};

const options = {
 method: 'POST',
 headers: {
   'Content-Type': 'application/json'
 },
 body: JSON.stringify(payload)
};

try {
 const response = await fetch(endPoint, options);
 const responseData = await response.json();
//console.log(responseData,'respData')
 // Handle success and error responses
 if (response.ok) {
   if (responseData.success === "true") {
     return ("");
   } else {
     // Handle specific error codes in the response data
     console.log(responseData,"1st else56");
   

     
   }
 } else {
   // Handle network or other HTTP errors
   console.log(responseData,"2nd else 62")
  
}
} catch (error) {
 console.error('Error sending WhatsApp message:',error);
 
}
}