"use client";

import { forwardRef } from "react";
import { Button } from "./button";
import { type ButtonProps } from "./button";

const ClientButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <Button
        className={className}
        variant={variant}
        size={size}
        asChild={asChild}
        ref={ref}
        {...props}
      />
    );
  }
);

ClientButton.displayName = "ClientButton";

export { ClientButton, type ButtonProps };