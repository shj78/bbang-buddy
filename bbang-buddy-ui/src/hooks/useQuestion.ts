import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { sendQuestion } from '../lib/userApi';

interface QuestionFormData {
  title: string;
  description: string;
}

export const useQuestion = (onSuccess?: () => void) => {
  const [formData, setFormData] = useState<QuestionFormData>({
    title: '',
    description: '',
  });

  const mutation = useMutation({
    mutationFn: sendQuestion,
    onSuccess: () => {
      toast.success('문의가 성공적으로 전송되었습니다.');
      resetForm();
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`문의 전송에 실패했습니다.: ${error}`);
    },
  });

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('제목과 내용을 모두 입력해주세요.');
      return;
    }
    mutation.mutate(formData);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
    });
  };

  const updateFormData = (field: keyof QuestionFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    updateFormData,
    handleSubmit,
    resetForm,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
};
