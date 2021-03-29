import { useState } from "react";

export const InputBox = ({
  button,
  label,
  value,
  setValue,
  pattern,
  message,
  showMessage,
  ...rest
}) => {
  const [showMsg, setShowMsg] = useState(showMessage);
  return (
    <div className='input-box'>
    {label || (message && showMsg) ? 
      <div className='input-box-label-container'>
        <label style={label? {}:{paddingRight: '0'}}>{label}</label>
        <span className='input-condition-message'>
          {showMsg && !value.match(pattern) ? message : ''}
        </span>
      </div>:<></>
    }
      <div className='input-box-input-container'>
        <input
          className={button ? 'input-round input-with-button' : 'input-round'}
          pattern={pattern}
          value={value}
          onFocus={() => setShowMsg(true)}
          onBlur={() => {}}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          autoCapitalize='none'
          {...rest}
        ></input>
        {button}
      </div>
    </div>
  );
};
export const InputButtonBox = ({ name, submit, ...props }) => {
  const button = (
    <button className='button-in-input' onClick={submit}>
      {name}
    </button>
  );
  return <InputBox button={button} {...props} />;
};
