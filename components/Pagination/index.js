import { Fragment } from 'react';
import { SfIconChevronLeft, SfIconChevronRight } from '@storefront-ui/react';


export function PaginationComponent({ setOffset, offset, productCount, limit }) {
// Calculates the total number of pages based on the total number of products (productCount) and the limit of products per page (limit).
  const totalPages = Math.ceil(productCount / limit) 
  // console.log(totalPages, 'pages');
  // currentPage: Calculates the current page based on the current offset and limit.
  const currentPage = Math.floor(offset / limit) + 1;
  // maxVisiblePages: Defines the maximum number of visible pages in the pagination control.
  const maxVisiblePages = 5;
  // startPage and endPage: Determine the range of pages to be displayed based on the current page and the maximum visible pages.
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
  // pageIndex: Generates an array of page numbers to be displayed, ranging from startPage to endPage.
  const pageIndex = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);


  return (
    <nav
      className="flex gap-3 items-center justify-center md:justify-end  border-t border-MFC-White mt-5"
      role="navigation"
      aria-label="pagination"
    >

      <button className=" mt-5 join-item font-bold w-[2rem] h-[2rem] btn-square rounded-full btn-outline hover:bg-extraa-purple-btn disabled:hidden" disabled={!offset} onClick={() => setOffset((prev) => prev - limit)}> <SfIconChevronLeft /></button>
      <div className="join mt-5 ">
        {pageIndex.map((page, index) => (
          
          <button key={index} className={`join-item btn w-[2rem] h-[2rem] font-bold rounded-full btn-xs md:btn-sm ${offset === (page-1)*limit  ? "bg-extraa-purple-btn" : ''} `}
            onClick={() => setOffset((page-1)* limit)}
            >
              {/* {console.log((page-1)* limit, 'offset')} */}
              <span className='text-MFC-black'>
              {page}
              </span>
          </button>
        ))
        }
      </div>

      <button className="join-item  font-bold btn-square w-[2rem] h-[2rem] rounded-full btn-outline disabled:hidden hover:bg-extraa-purple-btn mt-5" onClick={() => setOffset((prev) => prev + limit)}
        disabled={(productCount-offset)<limit}> <SfIconChevronRight />
        </button>


    </nav>
  );
}
