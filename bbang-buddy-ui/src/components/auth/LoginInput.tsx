import { TextField } from '@mui/material';
import { getBasicFieldStyles } from '../../styles/textFieldStyles';
import { LoginRequest } from '../../types/auth';

export default function LoginInput({
  formData,
  setFormData,
  isPending,
}: {
  formData: LoginRequest;
  setFormData: React.Dispatch<React.SetStateAction<LoginRequest>>;
  isPending: boolean;
}) {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <TextField
        label="아이디"
        name="userId"
        type="text"
        value={formData.userId}
        onChange={handleInputChange}
        sx={getBasicFieldStyles()}
        disabled={isPending}
        required
        autoComplete="off"
      />

      <TextField
        label="비밀번호"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleInputChange}
        sx={getBasicFieldStyles()}
        disabled={isPending}
        required
        autoComplete="current-password"
      />
    </>
  );
}
