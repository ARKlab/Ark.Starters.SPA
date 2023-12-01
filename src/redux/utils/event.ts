import React from "react";
import * as R from "ramda";

export const stopPropagation = (e: React.SyntheticEvent) => {
  e.stopPropagation();
};

export const unlessChild = (fn: () => void) =>
  R.unless(
    (e: React.FocusEvent<HTMLDivElement>) =>
      e.target.contains((e as any).relatedTarget),
    fn
  );

export const onEnter = (fn: any) =>
  R.when(
    (event: React.KeyboardEvent<HTMLDivElement>) => event.key === "Enter",
    fn
  );
