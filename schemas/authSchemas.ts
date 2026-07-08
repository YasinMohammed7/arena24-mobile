import { z } from "zod";
import i18n from "@/i18n/config";

// Phone registration schema
export const getPhoneSchema = () =>
  z.object({
    phone: z
      .string()
      .trim()
      .min(1, { message: i18n.t("validation.phoneRequired") })
      .refine(
        (val) => {
          // Check if it starts with + or is just digits
          const startsWithPlus = val.startsWith("+");
          const restOfNumber = startsWithPlus ? val.slice(1) : val;

          // Only allow digits after the optional +
          if (!/^\d+$/.test(restOfNumber)) {
            return false;
          }

          // Check length of digits (10-20 digits)
          return restOfNumber.length >= 10 && restOfNumber.length <= 20;
        },
        { message: i18n.t("validation.phoneInvalid") }
      ),
  });

export const phoneSchema = getPhoneSchema();

// Email registration schema
export const getEmailRegistrationSchema = () =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, { message: i18n.t("validation.emailRequired") })
      .email({ message: i18n.t("validation.emailInvalid") }),
  });

export const emailRegistrationSchema = getEmailRegistrationSchema();

// Login schema
export const getLoginSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, { message: i18n.t("validation.emailRequired") })
      .email({ message: i18n.t("validation.emailInvalid") }),
    password: z
      .string()
      .min(1, { message: i18n.t("validation.passwordRequired") })
      .min(8, { message: i18n.t("validation.passwordInvalid") })
      .refine(
        (val) => {
          const hasUppercase = /[A-Z]/.test(val);
          const hasLowercase = /[a-z]/.test(val);
          const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(val);
          return hasUppercase && hasLowercase && hasSpecialChar;
        },
        { message: i18n.t("validation.passwordInvalid") }
      ),
  });

export const loginSchema = getLoginSchema();

// Complete registration schema
export const getCompleteRegistrationSchema = () =>
  z
    .object({
      first_name: z
        .string()
        .min(1, { message: i18n.t("validation.firstNameRequired") })
        .min(2, { message: i18n.t("validation.firstNameMinLength") }),
      last_name: z
        .string()
        .min(1, { message: i18n.t("validation.lastNameRequired") })
        .min(2, { message: i18n.t("validation.lastNameMinLength") }),
      phone: z
        .string()
        .min(1, { message: i18n.t("validation.phoneRequired") })
        .refine(
          (val) => {
            const startsWithPlus = val.startsWith("+");
            const restOfNumber = startsWithPlus ? val.slice(1) : val;
            if (!/^\d+$/.test(restOfNumber)) return false;
            return restOfNumber.length >= 10 && restOfNumber.length <= 20;
          },
          { message: i18n.t("validation.phoneInvalid") }
        ),
      password: z
        .string()
        .min(1, { message: i18n.t("validation.passwordRequired") })
        .refine((password) => password.length >= 8, {
          message: i18n.t("validation.passwordMinLength"),
        })
        .refine((password) => /[a-z]/.test(password), {
          message: i18n.t("validation.passwordLowercase"),
        })
        .refine((password) => /[A-Z]/.test(password), {
          message: i18n.t("validation.passwordUppercase"),
        })
        .refine((password) => /\d/.test(password), {
          message: i18n.t("validation.passwordDigit"),
        })
        .refine(
          (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
          {
            message: i18n.t("validation.passwordSpecialChar"),
          }
        ),
      confirmPassword: z
        .string()
        .min(1, { message: i18n.t("validation.confirmPasswordRequired") }),
    })
    .refine(
      (data) => {
        if (data.confirmPassword && data.password) {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: i18n.t("validation.passwordsDontMatch"),
        path: ["confirmPassword"],
      }
    );

export const completeRegistrationSchema = getCompleteRegistrationSchema();

// Forgot password schema
export const getForgotPasswordSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, { message: i18n.t("validation.emailRequired") })
      .email({ message: i18n.t("validation.emailInvalid") }),
  });

export const forgotPasswordSchema = getForgotPasswordSchema();

export const getResetPasswordSchema = () =>
  z
    .object({
      password: z
        .string()
        .min(1, { message: i18n.t("validation.passwordRequired") })
        .refine((password) => password.length >= 8, {
          message: i18n.t("validation.passwordMinLength"),
        })
        .refine((password) => /[a-z]/.test(password), {
          message: i18n.t("validation.passwordLowercase"),
        })
        .refine((password) => /[A-Z]/.test(password), {
          message: i18n.t("validation.passwordUppercase"),
        })
        .refine((password) => /\d/.test(password), {
          message: i18n.t("validation.passwordDigit"),
        })
        .refine(
          (password) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
          {
            message: i18n.t("validation.passwordSpecialChar"),
          }
        ),
      confirmPassword: z
        .string()
        .min(1, { message: i18n.t("validation.confirmPasswordRequired") }),
    })
    .refine(
      (data) => {
        if (data.confirmPassword && data.password) {
          return data.password === data.confirmPassword;
        }
        return true;
      },
      {
        message: i18n.t("validation.passwordsDontMatch"),
        path: ["confirmPassword"],
      }
    );

export const resetPasswordSchema = getResetPasswordSchema();

// Booking schema function to accept dynamic maxPeople
export const createBookingSchema = (maxPeople: number) =>
  z.object({
    numberOfParticipants: z
      .string()
      .min(1, { message: i18n.t("validation.participantsRequired") })
      .refine(
        (val) => {
          const num = parseInt(val, 10);
          return !isNaN(num) && num >= 1 && num <= maxPeople;
        },
        {
          message: i18n.t("validation.participantsRange", { max: maxPeople }),
        }
      ),
    specialRequirements: z.string().optional(),
  });

// Static booking schema for backward compatibility
export const bookingSchema = createBookingSchema(999);

// Type exports for easier use in components
export type EmailRegistrationFormData = z.infer<
  ReturnType<typeof getEmailRegistrationSchema>
>;
export type PhoneFormData = z.infer<ReturnType<typeof getPhoneSchema>>;
export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
export type CompleteRegistrationFormData = z.infer<
  ReturnType<typeof getCompleteRegistrationSchema>
>;
export type ForgotPasswordFormData = z.infer<
  ReturnType<typeof getForgotPasswordSchema>
>;
export type ResetPasswordFormData = z.infer<
  ReturnType<typeof getResetPasswordSchema>
>;
export type BookingFormData = z.infer<typeof bookingSchema>;
