import { IMaskInputProps, IMaskMixin } from 'react-imask';
import { InputGroupInput } from './input-group';

export const MaskedInputGroupInput = IMaskMixin<
 HTMLInputElement,
 IMaskInputProps<HTMLInputElement>
>(({ inputRef, ...props }) => <InputGroupInput {...props} ref={inputRef} />);
