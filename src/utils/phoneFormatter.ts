
export const formatPhoneToChatId = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');

  const normalized =
    digits.startsWith('8') && digits.length === 11
      ? '7' + digits.slice(1)
      : digits;

  return `${normalized}@c.us`;
};

export const formatChatIdToPhone = (chatId: string): string => {
  const digits = chatId.replace('@c.us', '');
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9)}`;
  }
  return `+${digits}`;
};