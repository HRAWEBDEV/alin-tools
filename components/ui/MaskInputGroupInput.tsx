import { IMaskInputProps, IMaskMixin } from 'react-imask';
import { InputMaskElement, MaskElement } from 'imask';
import { InputGroupInput } from './input-group';

export const MaskedInputGroupInput = IMaskMixin<
 InputMaskElement,
 IMaskInputProps<MaskElement>
>(({ inputRef, ...props }) => (
 <InputGroupInput {...props} ref={inputRef as React.Ref<HTMLInputElement>} />
));
