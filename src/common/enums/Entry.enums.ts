export enum EntryType {
  ENTRY = 'ENTRY', // Giriş (Check-in)
  EXIT = 'EXIT', // Çıkış (Check-out)
}

export enum EntryStatus {
  SUCCESS = 'SUCCESS', // Başarılı Erişim
  FAIL_EXPIRED = 'FAIL_EXPIRED', // Token süresi dolmuş
  FAIL_INVALID = 'FAIL_INVALID', // Geçersiz token/veri
  FAIL_NO_ACCESS = 'FAIL_NO_ACCESS', // Erişim yetkisi yok (Banlı/Pasif)
}
