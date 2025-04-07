import { SfButton, SfIconTune } from '@storefront-ui/react';
import Image from 'next/image';
import React from 'react'
import { RangeSlider } from 'rsuite';
import filter from "@/public/icons/filter.png";

const StaticFilter = ({
  nodeRefer,
  drawerRefer,
  openModel,
  toggleOpen,
  rangeHandler,
  setFilterpress,
  handleCate,
  handleBrandPress,
  handleClearPress,
  brandData,
  cateData,
  selectedCate,
  valueFirst,
  valueSecond,
  toggleSecond,
  toggleFirst,
  priceRange,
  location, 
  handleLocation
}) => {
  return (
    <div className=' border-r-2 pl-3 left-0 pr-3 min-w-[250px] w-[25%]'>
      <header className='flex items-center '>
        <Image src={filter} alt='filter' />
        <h1 className="text-left pl-2  py-2 font-bold text-xl">Filters</h1>

      </header>
      {priceRange && priceRange.length > 0 &&
        <div className='w-full  '>
          <p className='pb-3 text-sm font-bold text-black'>Price range (₹)</p>
          <RangeSlider min={0} max={500} defaultValue={[0, 500]} onChange={rangeHandler} />
          <div className="flex items-center justify-between pt-3 space-x-4 text-sm text-MFC-black">
            <div>
              <input type="text" maxLength="5" x-model="minprice" className="w-24 px-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-yellow-400 focus:outline-none" value={valueFirst} onChange={(e) => toggleFirst(e.target.value)} />
            </div>
            -
            <div>
              <input type="text" maxLength="5" x-model="maxprice" className="w-24 px-3 py-2 text-center border border-gray-200 rounded-lg bg-gray-50 focus:border-yellow-400 focus:outline-none" value={valueSecond} onChange={(e) => toggleSecond(e.target.value)} />
            </div>
          </div>
        </div>
      }
      <div>
        <form onSubmit={setFilterpress}>

          {location && location.length > 0 &&
            <div className='w-full'>
              <p className="pb-1  text-neutral-900 font-bold mt-10 font-body">Location</p>
              <div className='max-h-44 overflow-auto overflow-y-scroll'>
                {location?.map((i, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <input type="checkbox" id={i?.label} name={i?.label} value={i?.label} checked={i?.check} onChange={handleLocation} />
                    <label htmlFor={i?.label}>{i?.label}</label>
                  </div>
                ))}
              </div>
            </div>}

          {cateData && cateData.length > 0 &&
            <div className='w-full'>
              <p className="pb-1  text-MFC-black font-bold mt-10 font-body">Categories</p>
              <div className='max-h-44 overflow-auto overflow-y-scroll'>
                {cateData?.map((i, index) => (
                  <div className="flex items-center gap-2 text-MFC-black" key={index}>
                    <input type="checkbox" id={i?.label} name={i?.label} value={i?.label} checked={i?.check} onChange={handleCate} />
                    <label className='text-MFC-black' htmlFor={i?.label}>{i?.label}</label>
                  </div>
                ))}
              </div>
            </div>}




          {brandData && brandData.length > 0 &&
            <>
              <div className='max-h-44 w-full mt-10 overflow-y-scroll'>
                <p className='font-bold text-MFC-black font-body mb-3'>Brand</p>
                {brandData?.map((i, index) => (
                  <div className="flex items-center gap-2" key={index}>
                    <input type="checkbox" id={i?.label} name={i?.label} value={i?.label} checked={i?.check} onChange={handleBrandPress} />
                    <label htmlFor={i?.label}>{i?.label}</label>
                  </div>
                ))}
              </div>

              <div className='flex gap-1 mb-2'>
                <SfButton className=' w-[30%] text-xs h-8 mt-3.5 mx-0 mb-0' variant="secondary" onClick={handleClearPress}>Clear</SfButton>
                <SfButton className='bg-extraa-blue text-MFC-black  w-full text-xs h-8 mt-3.5 mx-0 mb-0' type='submit' ><span className='text-MFC-slate-white'>  Apply Filter</span></SfButton>
              </div>
            </>
          }
        </form>
      </div>
    </div>
  )
}

export default StaticFilter