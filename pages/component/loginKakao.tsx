import * as React from 'react';
import clsx from 'clsx';
import { ButtonUnstyledProps, useButton } from '@mui/base/ButtonUnstyled';
import { styled } from '@mui/system';
import Image from 'next/image';

const CustomButtonRoot = styled('button')`
  background-repeat: no-repeat;
  background-size: cover;
  cursor: pointer;
  border: none;
  background-color: rgba( 255, 255, 255, 0 );
`;

const CustomButton = React.forwardRef(function CustomButton(
  props: ButtonUnstyledProps,
  ref: React.ForwardedRef<any>,
) {
  const { children } = props;
  const { active, getRootProps } = useButton({
    ...props,
    ref,
  });

  const classes = {
    active,
  };

  return (
    <CustomButtonRoot {...getRootProps()} className={clsx(classes)}>
      {children}
    </CustomButtonRoot>
  );
});

export default function UseButton() {
  return (
    <CustomButton>
      <Image
        src="/asset/kakao_login_icon.png"
        alt="Kakao Login"
        width="75"
        height="75"
      />
    </CustomButton>
  );
}