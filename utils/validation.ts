export const validateEmail = (value: string): string | null => {
  if (!value) return "Введите email";
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    return "Введите корректный email";
  }
  return null;
};

export const validatePassword = (value: string): string | null => {
  if (!value) return "Введите пароль";
  if (value.length < 8) return "Минимум 8 символов";
  if (!/[A-Z]/.test(value)) return "Нужна заглавная буква";
  if (!/[0-9]/.test(value)) return "Нужна цифра";
  return null;
};