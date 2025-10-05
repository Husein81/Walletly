// global imports
import React from "react";

// local imports
import { Rn, Text } from "../ui";

export type ToggleOption = {
  value: string;
  label: string;
  className?: string;
};

type SingleProps = {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: "single";
};

type MultipleProps = {
  options: ToggleOption[];
  value: string[];
  onChange: (value: string[]) => void;
  className?: string;
  type: "multiple";
};

function ToggleGroup(props: SingleProps): React.ReactElement;
function ToggleGroup(props: MultipleProps): React.ReactElement;

function ToggleGroup(props: SingleProps | MultipleProps) {
  const { options, className = "" } = props;
  const type = props.type ?? "single";

  if (type === "multiple") {
    return (
      <Rn.ToggleGroup
        className={className}
        type="multiple"
        value={props.value as string[]}
        onValueChange={(v: string[]) => {
          if (v) (props as MultipleProps).onChange(v);
        }}
      >
        {options.map((opt) => (
          <Rn.ToggleGroupItem
            key={opt.value}
            value={opt.value}
            className={opt.className}
          >
            <Text className="px-2">{opt.label}</Text>
          </Rn.ToggleGroupItem>
        ))}
      </Rn.ToggleGroup>
    );
  }

  return (
    <Rn.ToggleGroup
      className={className}
      type="single"
      value={props.value as string}
      onValueChange={(v: string | undefined) => {
        if (typeof v === "string") (props as SingleProps).onChange(v);
      }}
    >
      {options.map((opt) => (
        <Rn.ToggleGroupItem
          key={opt.value}
          value={opt.value}
          className={opt.className}
        >
          <Text className="px-2">{opt.label}</Text>
        </Rn.ToggleGroupItem>
      ))}
    </Rn.ToggleGroup>
  );
}

export default ToggleGroup;
