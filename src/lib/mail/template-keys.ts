/** Klucze szablonów — treść + logi NotificationLog (spójne nazewnictwo). */
export const MAIL_TEMPLATE_KEY = {
  ORDER_CREATED_CLIENT: "mail.order-created.client",
  ORDER_CREATED_ADMIN: "mail.order-created.admin",
  ORDER_UPDATE_CLIENT: "mail.order-update.client",
  ORDER_MESSAGE_ADMIN: "mail.order-message.admin",
  WELCOME_GOOGLE: "mail.welcome.google",
  VERIFY_EMAIL_CLIENT: "mail.verify-email.client",
  PASSWORD_RESET_CLIENT: "mail.password-reset.client",
  CONTACT_ADMIN: "mail.contact.admin",
} as const;
