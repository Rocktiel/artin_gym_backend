export enum UserTypes {
  SUPER_ADMIN = 'SUPER_ADMIN', // Sistemin tamamını yöneten kişi
  COMPANY_ADMIN = 'COMPANY_ADMIN', // Bir tenant'ın (spor salonunun) tüm yönetim yetkisi
  MEMBER = 'MEMBER', // Spor salonu üyesi (uygulamayı kullanan son kullanıcı)
}
