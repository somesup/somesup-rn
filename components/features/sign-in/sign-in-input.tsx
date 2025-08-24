import React from "react";
import { TextInput, TextInputProps } from "react-native";
import { cn } from "@/lib/utils";

type SignInInputProps = TextInputProps & {
  className?: string;
};

const SignInInput = ({ className, ...props }: SignInInputProps) => {
  return (
    <TextInput
      className={cn(
        "h-[60px] w-full bg-gray-20 rounded-lg border text-[16px] border-gray-30 p-[16px] text-gray-60 include-font-padding",
        className
      )}
      placeholderTextColor="#888888"
      style={{ opacity: props.editable === false ? 0.5 : 1 }}
      {...props}
    />
  );
};

export default SignInInput;
