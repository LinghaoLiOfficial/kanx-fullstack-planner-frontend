export type PasswordRule = {
  id: string;
  label: string;
  valid: boolean;
};

export function getPasswordRules(password: string): PasswordRule[] {
  return [
    { id: "length", label: "至少 8 位", valid: password.length >= 8 },
    { id: "uppercase", label: "包含大写字母", valid: /[A-Z]/.test(password) },
    { id: "lowercase", label: "包含小写字母", valid: /[a-z]/.test(password) },
    { id: "number", label: "包含数字", valid: /\d/.test(password) },
    {
      id: "special",
      label: "包含特殊字符",
      valid: /[^A-Za-z0-9\s]/.test(password),
    },
    { id: "space", label: "不能包含空格", valid: !/\s/.test(password) },
  ];
}

export function isStrongPassword(password: string) {
  return getPasswordRules(password).every((rule) => rule.valid);
}
