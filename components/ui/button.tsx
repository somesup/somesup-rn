import React from "react";
import { TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from "react-native";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Text from "@/components/ui/text";

const buttonVariants = cva("flex-row items-center justify-center rounded-lg", {
  variants: {
    variant: {
      default: "bg-gray-60",
      secondary: "bg-gray-20 border border-gray-30",
      ghost: "bg-transparent",
    },
    size: {
      sm: "px-3 py-2",
      default: "px-4 py-3",
      lg: "px-6 py-4",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const textColorVariants = cva("typography-body1", {
  variants: {
    variant: {
      default: "text-gray-10",
      secondary: "text-gray-60",
      ghost: "text-gray-60",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface ButtonProps extends TouchableOpacityProps, VariantProps<typeof buttonVariants> {
  loading?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<React.ElementRef<typeof TouchableOpacity>, ButtonProps>(
  ({ className, variant, size, loading = false, children, disabled, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }), isDisabled && "opacity-50")}
        disabled={isDisabled}
        {...props}
      >
        {loading && (
          <ActivityIndicator
            size="small"
            color={variant === "default" ? "#171717" : "#fafafa"}
            style={{ marginRight: 8 }}
          />
        )}
        <Text className={textColorVariants({ variant })}>{children}</Text>
      </TouchableOpacity>
    );
  }
);

Button.displayName = "Button";

export default Button;
