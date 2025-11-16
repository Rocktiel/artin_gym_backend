export function formatPhoneForSms(input: string): string {
  // Sayı olmayan tüm karakterleri temizle
  let digits = input.replace(/\D/g, '');

  // Eğer numara 0 ile başlıyorsa (ör: 0555...) baştaki 0'ı kaldır
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }

  // Eğer numara zaten 90 ile başlamıyorsa ülke kodunu ekle
  if (!digits.startsWith('90')) {
    digits = '90' + digits;
  }

  // Sms formatı: +905556667788
  return '+' + digits;
}
