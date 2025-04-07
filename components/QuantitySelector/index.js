"use client";
import { SfButton, SfIconAdd, SfIconRemove } from '@storefront-ui/react';
import { useCounter } from 'react-use';
import { useId, useState } from 'react';
import { clamp } from '@storefront-ui/shared';

const QuantitySelector = ({ quantity, type, maxi }) => {
    const [visible, setVisible] = useState(false)
    const inputId = useId();
    const min = 0;
    const max = maxi || 100;
    const [value, { inc, dec, set }] = useCounter(min);
    function handleOnChange(event) {
        const { value: currentValue } = event.target;
        const nextValue = parseFloat(currentValue);
        set(clamp(nextValue, min, max));
    }

    function onAddClick(e) {
        e?.preventDefault();
        inc()
        quantity(value + 1, type)
        setVisible(true)
    }

    return (
        <div className="inline-flex flex-col items-center">
            <div className="flex border border-neutral-300 rounded-md">
                {!visible ?
                    <div className='cursor-pointer gap-2 text-[#6B21A8] w-[125px] h-[40px] flex flex-row items-center justify-center font-semibold' onClick={(e) => { onAddClick(e) }}>
                        Add
                    </div>
                    :
                    <>
                        <SfButton
                            variant="tertiary"
                            square
                            className="rounded-r-none"
                            disabled={value <= min}
                            aria-controls={inputId}
                            aria-label="Decrease value"
                            onClick={() => {
                                dec()
                                quantity(value - 1, type)
                            }}
                        >
                            <SfIconRemove color='#6B21A8' />
                        </SfButton>
                        <input
                            id={inputId}
                            type="number"
                            role="spinbutton"
                            className="text-[#6B21A8] appearance-none mx-2 w-8 text-center bg-transparent font-medium [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:display-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-outer-spin-button]:display-none [&::-webkit-outer-spin-button]:m-0 [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none disabled:placeholder-disabled-900 focus-visible:outline focus-visible:outline-offset focus-visible:rounded-sm"
                            min={min}
                            max={max}
                            value={value}
                            disabled
                        // onChange={handleOnChange}
                        />
                        <SfButton
                            variant="tertiary"
                            square
                            className="rounded-l-none"
                            disabled={value >= max}
                            aria-controls={inputId}
                            aria-label="Increase value"
                            onClick={() => {
                                inc()
                                quantity(value + 1, type)
                            }}
                        >
                            <SfIconAdd color='#6B21A8' />
                        </SfButton>
                    </>
                }

            </div>
            {/* <p className="text-xs mt-2 text-neutral-500">
        <strong className="text-neutral-900">{max}</strong> in stock
      </p> */}
        </div>
    );
}

export default QuantitySelector;