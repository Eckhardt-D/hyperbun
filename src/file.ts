import {AsAttachmentOptions, BlobAttachment} from './types';

export const asAttachment = (
  path: string,
  options: AsAttachmentOptions
): BlobAttachment => {
  const blob = Bun.file(path, {type: options.type});
  const filename = options.name;

  return {
    filename,
    blob,
  };
};
