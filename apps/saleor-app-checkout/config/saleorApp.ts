import { FileAPL } from "@saleor/app-sdk/APL";
// import { RestAPL } from "./RestAPL";

export const apl = new FileAPL();

// export const apl = new RestAPL({url: "xxx"}})
// export const getAuthData = async ()=>{
//     const allAuthData = await apl.getAll()
//     if(!allAuthData.length){
//         throw new Error("")
//     }
//     return {
//         domain: allAuthData[0].domain,
//         token: allAuthData[0].token,
//         apiUrl: `https://${allAuthData[0].domain}/graphql/`
//     }
// }
