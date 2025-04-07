"use client";
import { SfButton, SfIconChevronLeft, SfIconChevronRight, SfDrawer, SfDropdown, SfIconClose, useDisclosure, useTrapFocus, SfCheckbox, SfSelect, } from '@storefront-ui/react';
import { Transition } from 'react-transition-group';
import { RangeSlider } from 'rsuite';
import classNames from 'classnames';

const FilterDrawer = ({
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
  const placement = 'left';
  return (
    <Transition ref={nodeRefer} in={openModel} timeout={300}>
      {(state) => (
        <SfDrawer
          ref={drawerRefer}
          open
          placement={placement}
          onClose={() => toggleOpen(false)}
          className={classNames(
            'bg-[#1D232A] min-w-[250px] duration-500 transition ease-in-out z-[999] rounded-r-2xl',
            {
              'translate-x-0': state === 'entered',
              '-translate-x-full': (state === 'entering' || state === 'exited'),
            },
          )}
        >
          <header className="flex items-center justify-between px-3 bg-[#1D232A]">
            <div className="flex items-center text-MFC-White">
              {/* <SfIconFavorite className="mr-2 " /> */}
              Filters
            </div>
            <SfButton
              square
              variant="tertiary"
              onClick={() => {
                toggleOpen(!openModel);
              }}
              className="text-white"
            >
              <SfIconClose />
            </SfButton>
          </header>

          {priceRange && priceRange.length > 0 && <div className='w-full p-5'>
            <p className='pb-3 text-sm font-medium text-black'>Price range (₹)</p>
            <RangeSlider min={0} max={500} defaultValue={[0, 500]} onChange={rangeHandler} />
            <div className="flex items-center justify-between pt-3 space-x-4 text-sm text-gray-700">
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
          <div className='p-3'>
            <form onSubmit={setFilterpress}>
              <div className='h-[80vh] overflow-y-scroll'>
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
                <>
                  <p className="pb-1 font-medium text-MFC-White font-body">Categories</p>
                  <div className='max-h-44 overflow-auto overflow-y-scroll'>
                    {cateData?.map((i, index) => (
                      <div className="flex items-center gap-2" key={index}>
                        <input type="checkbox" id={i?.label} name={i?.label} value={i?.label} checked={i?.check} onChange={handleCate} />
                        <label htmlFor={i?.label}>{i?.label}</label>
                      </div>
                    ))}
                  </div>
                </>
              }

              {brandData && brandData.length > 0 &&
                <>

                  <div className='flex justify-between mt-4'>
                    <p className=' text-MFC-White font-medium'>Brand</p>
                    <div className='flex gap-5'>
                      <SfIconChevronLeft />
                      <SfIconChevronRight />
                    </div>
                  </div>
                  <div className='max-h-44 overflow-auto'>
                    {brandData?.map((i, index) => (
                      <div className="flex items-center gap-2" key={index}>
                        <input type="checkbox" id={i?.label} name={i?.label} value={i?.label} checked={i?.check} onChange={handleBrandPress} />
                        <label htmlFor={i?.label}>{i?.label}</label>
                      </div>
                    ))}
                  </div>
                </>
              }
              </div>
              <div className='flex gap-1 mb-2 '>
                <SfButton className=' w-[30%] text-xs h-8 mt-3.5 mx-0 mb-0' variant="secondary" onClick={handleClearPress}>Clear</SfButton>
                <SfButton className='bg-extraa-purple-btn w-full text-xs h-8 mt-3.5 mx-0 mb-0' type='submit' ><p className='text-MFC-White'> Apply Filter</p></SfButton>
              </div>
            </form>
          </div>
        </SfDrawer>
      )}
    </Transition>
  )
}

export default FilterDrawer;