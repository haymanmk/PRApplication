import { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";

export const SettingsAutocomplete = (props) => {
  const [inputValue, setInputValue] = useState();

  const { optionKeys, textFieldLabel } = props;
  //   console.log(props.options);

  const combineOptionLabel = (option) => {
    if (optionKeys?.length > 1) {
      return optionKeys.reduce((previous, current) => option?.[previous] + option?.[current]);
    } else if (optionKeys?.length === 1) return option?.[optionKeys[0]];
    else return;
  };

  return (
    <Autocomplete
      inputValue={inputValue}
      onInputChange={(event, newValue) => {
        setInputValue(newValue);
      }}
      getOptionLabel={optionKeys?.length && ((option) => combineOptionLabel(option))}
      isOptionEqualToValue={
        optionKeys?.length &&
        ((option, value) => combineOptionLabel(option) == combineOptionLabel(value))
      }
      renderInput={(params) => <TextField {...params} label={textFieldLabel} />}
      renderOption={(props, option, { inputValue }) => {
        const matches = match(combineOptionLabel(option), inputValue, { insideWords: true });
        const parts = parse(combineOptionLabel(option), matches);

        return (
          <li {...props}>
            <div>
              {parts.map((part, index) => (
                <span key={index} style={{ fontWeight: part.highlight ? 700 : 400 }}>
                  {part.text}
                </span>
              ))}
            </div>
          </li>
        );
      }}
      {...props}
      options={props.options || []}
    />
  );
};
