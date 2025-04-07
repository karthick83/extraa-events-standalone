"use client";
import { SfButton, SfDropdown, SfIconFavoriteFilled, SfIconSort, useDisclosure } from "@storefront-ui/react";

const SortDropDown = ({
  data,
  toggleOpen,
  onclose,
  onSortClick,
  open
}) => {
  return (
    <>
      <div className="dropdown dropdown-end">
        <SfButton slotPrefix={<SfIconSort />} className='text-[#000] bg-white' tabIndex={0} variant='secondary' onClick={toggleOpen}>Sort</SfButton>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-gray-100 rounded-box w-52">
          {data?.map((x) => (
            <li className={`text-black text-sm  py-1.5 px-2 cursor-pointer ${x?.select ? "font-bold z-[99999] uc-bold" : "uc-regular"}`} onClick={(e) => onSortClick(e, x)} key={x?.id}>{x?.label}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default SortDropDown;