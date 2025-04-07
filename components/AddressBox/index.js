import { SfBadge, SfButton } from "@storefront-ui/react";
import React, { useEffect, useState } from "react";
import Loader from "../loader";

const AddressBox = ({
  address,
  editAddress,
  highlightedAddresses,
  setHighlightedAddresses,
  open
}) => {

  const handleClick = (id) => {
    setHighlightedAddresses(id === highlightedAddresses ? null : id);
  };
  useEffect(() => {       //useEffect to select the address in index [0] as default
    if (address && address.length > 0) {
      setHighlightedAddresses(address[0].id);
    }
  }, [address]);
  return (
    <>
      <div className="flex flex-row justify-between uc-sb">
        <h2 className="text-xl text-MFC-black font-bold mb-4 ">Your Addresses</h2>
        <p className="underline text-MFC-black cursor-pointer" onClick={open}>+ Add New</p>
      </div>
      {address?.length > 0 &&
        <div className="h-[500px] overflow-y-scroll no-scrollbar mb-2  divide-y-2 divide-dashed">
          {!address ? <Loader /> : (address?.map((address, key) => (
            <div
              key={address.id}
              style={{
                border:
                  highlightedAddresses === address.id ? "2px solid #FFF100" : "2px solid #B8B9BB",
                color: highlightedAddresses === address.id ? "#FFFFFF" : "#B8B9BB",
                fontWeight: highlightedAddresses === address.id ? "bold" : "normal",
                paddingTop: 10
              }}
              className="p-3 rounded-md mb-3 text-left ub-regular text-MFC-black border-MFC-White"
              onClick={() => handleClick(address.id)}
            >
              <div className="flex flex-row justify-between left-[-12px] relative ">
                {key === 0 &&
                  <p className="text-xs uc-sb font-normal py-2 px-4 bg-extraa-purple-btn rounded-r-full text-MFC-black ">
                    Default
                  </p>
                }
              </div>
              <div className="flex flex-row ub-sb mt-4 text-MFC-black">
                {/* <p>{key + 1}.</p> */}
                <header className="font-bold ml-4">{address?.full_name}</header>
                {/* {address?.default && (
                
              )} */}
              </div>
              <div className="divider mr-3 text-MFC-black"></div>
              <p className="ml-4 text-MFC-black">
                {address?.address_line_1 + " " + address?.address_line_2 + ", "}
              </p>
              <p className="ml-4 text-MFC-black">
                {address?.landmark +
                  " " +
                  address?.city +
                  ", " +
                  address?.state +
                  " " +
                  address?.pincode}
              </p>
              <p className="ml-4 text-MFC-black">Mobile : {address?.phone_number}</p>
              <div className="flex justify-end mt-5 gap-4">
                <button className="text-sm font-bold hover:underline text-red-700 cursor-not-allowed ">
                  <img src='/icons/delete_icon.png' alt="delete" />
                </button>
                <button
                  className="text-sm font-bold hover:underline text-green-700"
                  onClick={(e) => {
                    editAddress(e, address);
                  }}
                >
                  <img src='/icons/edit_icon.png' alt="edit" />
                </button>
              </div>
            </div>
          )))}
        </div>
      }
      {
        address?.length === 0 &&
        <div className="flex h-full items-center justify-center text-green-600 text-2xl">
          Please add new address to select billing address
        </div>
      }
    </>
  );
};

export default AddressBox;
