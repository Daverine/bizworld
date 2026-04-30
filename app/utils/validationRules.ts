import { createRule } from "@regle/core";
import type { Maybe } from "@regle/core";
import { isFilled, matchRegex } from "@regle/rules";

export const maxFileSize = createRule({
  validator(file: Maybe<File>, maxBytes: number) {
    if (!isFilled(file)) return true;
    return file.size <= maxBytes;
  },
  message: ({ $params: [maxBytes] }) =>
    `File size must be less than ${(maxBytes as number) / (1024 * 1024)} MB`,
});

// Regex: Starts with a letter/number, allows letters, numbers, and hyphens

export const isSlug = createRule({
  validator: (value: Maybe<string>) => matchRegex(value, slugRegex),
  message: "Invalid slug format (lowercase, numbers, and hyphens only)",
});
