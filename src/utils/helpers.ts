import { all, is } from "ramda";

export const validateString = (x: any) => is(String)(x) && x.trim() !== "";

