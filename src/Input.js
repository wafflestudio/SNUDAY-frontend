import { useState } from 'react';

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
    <div className="input-box">
      {label || (message && showMsg) ? (
        <div className="input-box-label-container">
          <label style={label ? {} : { paddingRight: '0' }}>{label}</label>
          <span className="input-condition-message">
            {showMsg && !value.match(pattern) ? message : ''}
          </span>
        </div>
      ) : (
        <></>
      )}
      <div
        className="input-box-input-container"
        style={{ height: rest.style?.height }}
      >
        <input
          className={button ? 'input-round input-with-button' : 'input-round'}
          pattern={pattern}
          value={value}
          onFocus={() => setShowMsg(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') e.target.blur();
          }}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          autoCapitalize="none"
          {...rest}
        ></input>
        {button}
      </div>
    </div>
  );
};
export const InputButtonBox = ({
  name,
  submit,
  disabled = false,
  ...props
}) => {
  const button = (
    <button
      className="button-in-input"
      onClick={submit}
      disabled={!props.value.match(props.pattern) || disabled}
    >
      {name}
    </button>
  );
  return <InputBox button={button} {...props} />;
};
export const SearchBox = ({
  searchValue,
  setSearchValue,
  searchOptions,
  setSearchOption,
}) => {
  const [inputValue, setInputValue] = useState(searchValue);
  return (
    <div className="search-box" style={{ position: 'relative' }}>
      <InputBox
        value={inputValue}
        setValue={setInputValue}
        onBlur={() => setSearchValue(() => inputValue)}
        button={
          <img
            style={{ position: 'absolute', right: 20, top: 14 }}
            src="/resources/search-icon.svg"
            alt="search"
          />
        }
      />
      <select
        style={{ position: 'absolute', top: 0 }}
        name="channel-search-option"
        id="channel-search-option-select"
        onChange={(e) => setSearchOption(e.target.value)}
      >
        {Object.entries(searchOptions).map(([k, v]) => (
          <option key={k} value={k}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
};
