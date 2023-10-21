import { LuImage } from 'react-icons/lu';
import Button from './Button';
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { useEffect, useState } from 'react';
import { toastError } from './Toast';

export type ImageType = {
  imageFile: FileWithPath;
  imageBlob: string;
};

type Props = {
  setImage: (value: ImageType) => void;
  openRef: VoidFunction;
  isDisabled?: boolean;
};

export default function ButtonInputImage({
  setImage,
  openRef,
  isDisabled,
}: Props) {
  const [imageValue, setImageValue] = useState<FileWithPath>();

  useEffect(() => {
    if (imageValue) {
      setImage({
        imageFile: imageValue!,
        imageBlob: URL.createObjectURL(imageValue!),
      });
    }
  }, [imageValue, setImage]);

  const handleDropImage = (files: FileWithPath) => {
    const maxSize = 1 * 1024 * 1024; // 1MB
    if (files.size <= maxSize) {
      setImageValue(files);
    } else {
      toastError(
        'Image size exceeds 1MB. Please choose another image',
        'image'
      );
    }
  };

  return (
    <Dropzone
      accept={IMAGE_MIME_TYPE}
      onDrop={(e) => handleDropImage(e[0])}
      activateOnClick={true}
      openRef={openRef as VoidFunction}
      unstyled>
      <Button variant="outline" className="w-max" isDisabled={isDisabled}>
        <LuImage size={20} />
      </Button>
    </Dropzone>
  );
}
