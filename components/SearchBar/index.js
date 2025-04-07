// SearchBar.js

import React, { useEffect, useState } from 'react';
import { SfButton, SfIconLocationOn, SfIconLocationOnFilled, SfIconSearch, SfInput } from '@storefront-ui/react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

const SearchBar = ({ className }) => {
  const [input, setInput] = useState('');
  // const [query] = useDebounce(input, 1000)
  const route = useRouter();
  const currentPath = usePathname()
  //  console.log(currentPath,"current");
  const isDealsPage = currentPath.includes('/deals');
  const isGiftcardPage = currentPath.includes('/giftcard');

  useEffect(() => {
    if (isDealsPage && isGiftcardPage) {
      // console.log(isDealsPage,"deal");
      // console.log(isGiftcardPage,"gift");
      handleRedirect();
    }
  }, [ input, currentPath])
  const handleRedirect = (bool) => {
    if ( input === "" || bool) {
      route.push('/');
    } else if (input) {
      route.push(`/?search=${input}`);
    }

  };
  // onSubmit event
  const search = (e) => {
    e.preventDefault();
    // if(input&&query){
    //   route.push(`/?search=${input}`)
    // }
    handleRedirect();

  }
  return (
    <div className={className}>
      <form role="search" className="w-full uc-sb " onSubmit={search} >

        <SfInput
          value={input}
          type="search"
          className="[&::-webkit-search-cancel-button]:appearance-none bg-MFC-White"
          placeholder=""
          wrapperClassName="flex-1 h-10 pr-0 !rounded-full "
          size="base"
          disabled={false}
          onChange={(event) => {
            setInput(event.target.value)
            if (event.target.value === "") {
              handleRedirect(true)

            }

          }}
          slotPrefix={
            <span className='inline-flex items-center text-black uc-medium border-r-2 pr-5 h-full' style={{ cursor: 'pointer' }}>
              {/* <SfIconLocationOnFilled className='text-extraa-dark-purple fill-extraa-dark-purple mr-1' /> */}
              <p>Search</p>
            </span>
          }
          slotSuffix={
            <span className="flex items-center">
              <SfButton
                variant="tertiary"
                square
                aria-label="search"
                type="submit"
                className="!rounded-r-full bg-extraa-purple-btn"
                onSubmit={(event) => {
                  setInput(event.target.value)
                  if (event.target.value === "") {
                    handleRedirect(true)
      
                  }
      
                }}
              >
                <SfIconSearch className='text-Zoominfo-text-button bg-transparent' />
              </SfButton>
            </span>
          }

        />
      </form>
    </div>

  );
};

export default SearchBar;
