import { useRef, useState } from 'react';
import { useIntersection } from 'react-use';
import {
  SfScrollable,
  SfButton,
  SfIconChevronLeft,
  SfIconChevronRight,
} from '@storefront-ui/react';
import classNames from 'classnames';


// const images = [
//   { imageSrc: "https://storage.extraa.in/files/urbanGear1.jpeg", imageThumbSrc:"https://storage.extraa.in/files/urbanGear1.jpeg" , alt: 'backpack1' },
//   { imageSrc: "https://storage.extraa.in/files/urbanGear2.jpg", imageThumbSrc: "https://storage.extraa.in/files/urbanGear2.jpg", alt: 'backpack2' },
//   { imageSrc: "https://storage.extraa.in/files/urbanGear3.jpg", imageThumbSrc: "https://storage.extraa.in/files/urbanGear3.jpg", alt: 'backpack2' },
//   { imageSrc: "https://storage.extraa.in/files/urbanGear4.jpg", imageThumbSrc: "https://storage.extraa.in/files/urbanGear4.jpg", alt: 'backpack2' },
//   { imageSrc: "https://storage.extraa.in/files/urbanGear5.jpg", imageThumbSrc: "https://storage.extraa.in/files/urbanGear5.jpg", alt: 'backpack2' },
//   { imageSrc: "https://storage.extraa.in/files/urbanGear6.jpg", imageThumbSrc: "https://storage.extraa.in/files/urbanGear6.jpg", alt: 'backpack2' },

// ];

export default function ProductGallery({productImages}) {
  const lastThumbRef = useRef(null);
  const thumbsRef = useRef(null);
  const firstThumbRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const images = productImages?.map((src, index) => ({
    imageSrc: src,
    imageThumbSrc: src, 
    alt: "Image Not Found",
  }));

  const firstThumbVisible = useIntersection(firstThumbRef, {
    root: thumbsRef.current,
    rootMargin: '0px',
    threshold: 1,
  });

  const lastThumbVisible = useIntersection(lastThumbRef, {
    root: thumbsRef.current,
    rootMargin: '0px',
    threshold: 1,
  });

  const onDragged = (event) => {
    if (event.swipeRight && activeIndex > 0) {
      setActiveIndex((currentActiveIndex) => currentActiveIndex - 1);
    } else if (event.swipeLeft && activeIndex < images.length - 1) {
      setActiveIndex((currentActiveIndex) => currentActiveIndex + 1);
    }
  };

  return (
    <div className="relative flex w-full max-h-[600px] aspect-[4/3]">
      <SfScrollable
        ref={thumbsRef}
        className="items-center w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        direction="vertical"
        activeIndex={activeIndex}
        prevDisabled={activeIndex === 0}
        nextDisabled={activeIndex === images?.length - 1}
        slotPreviousButton={
          images?.length>1&&(
          <SfButton
            className={classNames('absolute !rounded-full z-10 top-4 rotate-90 bg-white', {
              hidden: firstThumbVisible?.isIntersecting,
            })}
            variant="secondary"
            size="sm"
            square
            slotPrefix={<SfIconChevronLeft size="sm" />}
          />)
        }
        slotNextButton={
          <SfButton
            className={classNames('absolute !rounded-full z-10 bottom-4 rotate-90 bg-white', {
              hidden: lastThumbVisible?.isIntersecting,
            })}
            variant="secondary"
            size="sm"
            square
            slotPrefix={<SfIconChevronRight size="sm" />}
          />
        }
      >
        {images&&images?.map(({ imageThumbSrc, alt }, index, thumbsArray) => (
          <button
            // eslint-disable-next-line no-nested-ternary
            ref={index === thumbsArray.length - 1 ? lastThumbRef : index === 0 ? firstThumbRef : null}
            type="button"
            aria-label={alt}
            aria-current={activeIndex === index}
            key={`${alt}-${index}-thumbnail`}
            className={classNames(
              'md:w-[78px] md:h-auto relative shrink-0 pb-1 mx-4 -mb-2 border-b-4 snap-center cursor-pointer focus-visible:outline focus-visible:outline-offset transition-colors flex-grow md:flex-grow-0',
              {
                'border-primary-700': activeIndex === index,
                'border-transparent': activeIndex !== index,
              },
            )}
            onMouseOver={() => setActiveIndex(index)}
            onFocus={() => setActiveIndex(index)}
          >
            <img alt={alt} className="border border-neutral-200" width="78" height="78" src={imageThumbSrc} />
          </button>
        ))}
      </SfScrollable>
      <SfScrollable
        className="w-full h-full snap-y snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        activeIndex={activeIndex}
        direction="vertical"
        wrapperClassName="h-full m-auto"
        buttonsPlacement="none"
        isActiveIndexCentered
        drag={{ containerWidth: true }}
        onDragEnd={onDragged}
      >
        {images&&images?.map(({ imageSrc, alt }, index) => (
          <div
            key={`${alt}-${index}`}
            className="flex justify-center h-full basis-full shrink-0 grow snap-center snap-always"
          >
            <img
              aria-label={alt}
              aria-hidden={activeIndex !== index}
              className="object-contain w-auto h-full"
              alt={alt}
              src={imageSrc}
            />
          </div>
        ))}
      </SfScrollable>
    </div>
  );
}
