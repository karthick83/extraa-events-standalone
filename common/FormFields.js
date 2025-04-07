"use client";
import { SfIconUnfoldMore, SfInput, SfSelect, SfTextarea } from "@storefront-ui/react"
import { useState } from "react"

export const TextBoxs = (name, label, choice, required, values, toggleValues, type, error) => {
  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-base font-medium">{`${label || name} `}<span className="text-red-600">{required && "*" || ""}</span></span>
        <SfInput
          name={label}
          value={values[label || name]}
          required={required}
          onChange={(e) => { toggleValues(e, label || name, type) }}
          type={type || 'text'}
          maxLength={100}
        />
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-red-600 font-medium mt-2">{error[label || name]}</p>
      </div>
    </>
  )
}

export const DropDown = (name, label, options, required, values, toggleValues, type, error) => {
  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-base font-medium">{`${label || name} `}<span className="text-red-600">{required && "*" || ""}</span></span>
      <SfSelect
        name={label}
        placeholder="-- Select --"
        required={required}
        onChange={(e) => { toggleValues(e, label || name, name) }}
        value={values[label || name]}
      >
        {options?.map((option) => (
          <option value={option} key={option}>
            {option}
          </option>
        ))}
      </SfSelect>
      <div className="flex justify-between">
        <p className="text-sm text-negative-700 font-medium mt-0.5">{error[label || name]}</p>
      </div>
    </div>
  )
}

export const RadioList = (name, label, radioOptions, required, values, toggleValues, type, error) => {

  return (
    <>
      <div className="mt-4 flex flex-col gap-2" >
        <span className="text-base font-medium">{`${label || name} `}<span className="text-red-600">{required && "*" || ""}</span></span>
        <div className="radioField" name={name}>
          {radioOptions?.map((x) => (
            <label key={x}>
              <input type="radio" id={x} name={label || name} checked={values[label || name] === x} value={x} onChange={(e) => { toggleValues(e, label || name) }} required={required} />
              <span htmlFor={x}>{x}</span>
            </label>
          ))}
        </div>
      </div>
    </>
  );
}

export const CheckBox = (name, label, radioOptions, required, values, toggleValues, type, error) => {
  // const valArr = []
  // function handleChange(e) {
  //   if (e.target.checked) {
  //     // toggleValues([...valArr, e.target.value]);
  //     valArr.push(e.target.value)
  //   } else {
  //     valArr.filter((item) => item !== e.target.value)
  //   }
  //   toggleValues(valArr, label || name)
  // }
  const val = radioOptions?.map(x => {
    const index = values[label || name]?.findIndex(i => i === x)
    return { label: x, checked: index > -1 }
  })

  return (
    <div className="mt-4 flex flex-col gap-2">
      <span className="text-base font-medium" >{`${label || name} `}<span className="text-red-600">{required && "*" || ""}</span></span>
      <div className="flex flex-col gap-4" name={name}>
        {val?.map((x) => (
          // <label className="checkboxs" key={x} htmlFor="checkbox">
          //   <input className="checkboxs__trigger visuallyhidden" type="checkbox"  name={x} onChange={handleChange}/>
          //   <span className="checkboxs__symbol">
          //     <svg aria-hidden="true" className="icon-checkboxs" width="28px" height="28px" viewBox="0 0 28 28" version="1" xmlns="http://www.w3.org/2000/svg">
          //       <path d="M4 14l8 7L24 7"></path>
          //     </svg>
          //   </span>
          //   <p className="checkboxs__textwrapper">{x}</p>
          // </label>
          <div className="form-control w-[50px]" key={x?.label}>
            <label className="cursor-pointer items-center gap-4 flex">
              <input type="checkbox" name={label} className="checkbox checkbox:extraa-blue" checked={x?.checked} value={x?.label} onChange={(e) => { toggleValues(e, label || name, type) }} />
              <span className="label-text">{x?.label}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  )
}

export const TextBoxName = (name, label, required, values, toggleValues, type, max, error) => {

  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-base font-medium">{`${label} ${required && "*" || ""}`}</span>
        <SfInput
          name={name}
          value={values}
          required={required}
          onChange={(e) => { toggleValues(e,label|| name, name) }}
          type={type || 'text'}
          maxLength={max || ''}
        />
      </div>
      <div className="flex justify-between text-red-600">
        <p className="text-sm text-negative-700 font-medium mt-0.5">{error}</p>
      </div>
    </>
  )
}

export const InputTextLong = (name, label, radioOptions, required, values, toggleValues, type, error) => {
  return (
    <>
      <div className="mt-4 flex flex-col gap-2">
        <span className="text-base font-medium">{`${label || name} `}<span className="text-red-600">{required && "*" || ""}</span></span>
        <textarea
          name={label}
          value={values[label || name]}
          required={required || false}
          onChange={(e) => { toggleValues(e, label || name) }}
          className="block w-full py-2 pl-4 pr-7 rounded-md border border-neutral-300 placeholder:text-neutral-500"
        />
      </div>
      <div className="flex justify-between">
        <p className="text-sm text-negative-700 font-medium mt-0.5">{error[label || name]}</p>
      </div>
    </>
  )
}