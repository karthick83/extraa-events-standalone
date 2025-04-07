import { SfInput } from "@storefront-ui/react"

export const TextBox=(name, label, value, toggleValue, disabled, type,maxlength,isValid,toggleIsvalid)=>{
    let Type='text'
    if(type){
        Type=type
    }
    return(
        <label>
        <span className="rota-sb typography-label-sm font-medium text-MFC-black">{label}</span>
        <SfInput
          value={value}
          invalid={isValid}
          required
          disabled={disabled}
        //  onInput={() => (value && isValid ? toggleIsvalid(false) : toggleIsvalid(true))}
         // onBlur={() => (value && isValid ? toggleIsvalid(false) : toggleIsvalid(true))}
          onChange={(event) => toggleValue(event)}
          name={name}
          type={Type}
          maxLength={maxlength}
          className="bg-white"
        />
        {isValid && (
          <p className="rota-sb mt-0.5 text-negative-700 typography-text-sm font-medium">The field cannot be empty</p>
        )}
      </label>
    )
}

export const Datepicker=(name, label, value, toggleValue, disabled,isValid)=>{
    <label>
        <span className="typography-label-sm font-medium text-MFC-black">{label}</span>
        <SfInput
          value={value}
          invalid={isValid}
          required
          disabled={disabled}
        //  onInput={() => (value && isValid ? toggleIsvalid(false) : toggleIsvalid(true))}
         // onBlur={() => (value && isValid ? toggleIsvalid(false) : toggleIsvalid(true))}
          onChange={(event) => toggleValue(event)}
          name={name}
          type="date"
        />
        {isValid && (
          <p className="mt-0.5 text-negative-700 typography-text-sm font-medium">The field cannot be empty</p>
        )}
      </label>
}