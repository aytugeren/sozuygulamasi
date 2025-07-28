export const getAuthErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Geçersiz e-posta adresi';
    case 'auth/missing-password':
      return 'Parola alanı boş bırakılamaz';
    case 'auth/weak-password':
      return 'Parola çok zayıf';
    case 'auth/email-already-in-use':
      return 'Bu e-posta zaten kullanılıyor';
    case 'auth/wrong-password':
      return 'Yanlış parola';
    case 'auth/user-not-found':
      return 'Kullanıcı bulunamadı';
    case 'auth/invalid-login-credentials':
    case 'auth/invalid-credential':
      return 'E-posta veya parola hatalı';
    default:
      return 'Bir hata oluştu. Lütfen tekrar deneyin';
  }
};
