import { createRule } from '@regle/core';
import type { Maybe } from '@regle/core';
import { isFilled } from '@regle/rules';

export const maxFileSize = createRule({
  validator: (file: Maybe<File>, maxBytes: number) => {
    if (!isFilled(file)) return true;
    return file.size <= maxBytes
  },
  message: ({ $params: [maxBytes] }) => `File size must be less than ${(maxBytes as number) / (1024 * 1024)} MB`, 
});
