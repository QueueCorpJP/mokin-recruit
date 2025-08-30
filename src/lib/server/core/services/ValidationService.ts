import 'reflect-metadata';
import { injectable } from 'inversify';
import { logger } from '@/utils/logger';

// バリデーション結果の型定義
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  field?: string;
}

// 複数フィールドのバリデーション結果
export interface MultiFieldValidationResult {
  isValid: boolean;
  fieldErrors: Record<string, string[]>;
  generalErrors: string[];
}

// バリデーションサービス (SRP準拠)
@injectable()
export class ValidationService {
  /**
   * メールアドレスの形式をバリデート
   */
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email) {
      errors.push('Email is required');
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('Invalid email format');
      }

      if (email.length > 254) {
        errors.push('Email is too long (max 254 characters)');
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      field: 'email',
    };
  }

  /**
   * 必須フィールドのバリデート
   */
  validateRequired(value: string, fieldName: string): ValidationResult {
    const errors: string[] = [];

    if (!value || value.trim().length === 0) {
      errors.push(`${fieldName} is required`);
    }

    return {
      isValid: errors.length === 0,
      errors,
      field: fieldName,
    };
  }

  /**
   * 文字列の長さをバリデート
   */
  validateLength(
    value: string,
    fieldName: string,
    minLength?: number,
    maxLength?: number
  ): ValidationResult {
    const errors: string[] = [];

    if (minLength && value.length < minLength) {
      errors.push(`${fieldName} must be at least ${minLength} characters long`);
    }

    if (maxLength && value.length > maxLength) {
      errors.push(
        `${fieldName} must be no more than ${maxLength} characters long`
      );
    }

    return {
      isValid: errors.length === 0,
      errors,
      field: fieldName,
    };
  }

  /**
   * 候補者登録データのバリデート
   */
  validateCandidateRegistration(data: {
    email: string;
    password: string;
    lastName: string;
    firstName: string;
    lastNameKana?: string;
    firstNameKana?: string;
    gender?: string;
  }): MultiFieldValidationResult {
    const fieldErrors: Record<string, string[]> = {};
    const generalErrors: string[] = [];

    // メールアドレス
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      fieldErrors.email = emailValidation.errors;
    }

    // パスワード
    const passwordValidation = this.validateRequired(data.password, 'Password');
    if (!passwordValidation.isValid) {
      fieldErrors.password = passwordValidation.errors;
    } else {
      const passwordLengthValidation = this.validateLength(
        data.password,
        'Password',
        8,
        128
      );
      if (!passwordLengthValidation.isValid) {
        fieldErrors.password = [
          ...(fieldErrors.password || []),
          ...passwordLengthValidation.errors,
        ];
      }
    }

    // 姓
    const lastNameValidation = this.validateRequired(
      data.lastName,
      'Last name'
    );
    if (!lastNameValidation.isValid) {
      fieldErrors.lastName = lastNameValidation.errors;
    } else {
      const lastNameLengthValidation = this.validateLength(
        data.lastName,
        'Last name',
        1,
        50
      );
      if (!lastNameLengthValidation.isValid) {
        fieldErrors.lastName = [
          ...(fieldErrors.lastName || []),
          ...lastNameLengthValidation.errors,
        ];
      }
    }

    // 名
    const firstNameValidation = this.validateRequired(
      data.firstName,
      'First name'
    );
    if (!firstNameValidation.isValid) {
      fieldErrors.firstName = firstNameValidation.errors;
    } else {
      const firstNameLengthValidation = this.validateLength(
        data.firstName,
        'First name',
        1,
        50
      );
      if (!firstNameLengthValidation.isValid) {
        fieldErrors.firstName = [
          ...(fieldErrors.firstName || []),
          ...firstNameLengthValidation.errors,
        ];
      }
    }

    // 姓（カナ）- オプショナル
    if (data.lastNameKana) {
      const lastNameKanaLengthValidation = this.validateLength(
        data.lastNameKana,
        'Last name (Kana)',
        1,
        50
      );
      if (!lastNameKanaLengthValidation.isValid) {
        fieldErrors.lastNameKana = lastNameKanaLengthValidation.errors;
      }
    }

    // 名（カナ）- オプショナル
    if (data.firstNameKana) {
      const firstNameKanaLengthValidation = this.validateLength(
        data.firstNameKana,
        'First name (Kana)',
        1,
        50
      );
      if (!firstNameKanaLengthValidation.isValid) {
        fieldErrors.firstNameKana = firstNameKanaLengthValidation.errors;
      }
    }

    // 性別 - オプショナル
    if (data.gender) {
      const validGenders = ['MALE', 'FEMALE', 'OTHER'];
      if (!validGenders.includes(data.gender)) {
        fieldErrors.gender = ['Invalid gender value'];
      }
    }

    const hasErrors =
      Object.keys(fieldErrors).length > 0 || generalErrors.length > 0;

    if (hasErrors) {
      logger.debug('Candidate registration validation failed', {
        fieldErrors,
        generalErrors,
      });
    }

    return {
      isValid: !hasErrors,
      fieldErrors,
      generalErrors,
    };
  }

  /**
   * 企業ユーザー登録データのバリデート
   */
  validateCompanyUserRegistration(data: {
    email: string;
    password: string;
    fullName: string;
    companyAccountId: string;
  }): MultiFieldValidationResult {
    const fieldErrors: Record<string, string[]> = {};
    const generalErrors: string[] = [];

    // メールアドレス
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      fieldErrors.email = emailValidation.errors;
    }

    // パスワード
    const passwordValidation = this.validateRequired(data.password, 'Password');
    if (!passwordValidation.isValid) {
      fieldErrors.password = passwordValidation.errors;
    } else {
      const passwordLengthValidation = this.validateLength(
        data.password,
        'Password',
        8,
        128
      );
      if (!passwordLengthValidation.isValid) {
        fieldErrors.password = [
          ...(fieldErrors.password || []),
          ...passwordLengthValidation.errors,
        ];
      }
    }

    // フルネーム
    const fullNameValidation = this.validateRequired(
      data.fullName,
      'Full name'
    );
    if (!fullNameValidation.isValid) {
      fieldErrors.fullName = fullNameValidation.errors;
    } else {
      const fullNameLengthValidation = this.validateLength(
        data.fullName,
        'Full name',
        1,
        100
      );
      if (!fullNameLengthValidation.isValid) {
        fieldErrors.fullName = [
          ...(fieldErrors.fullName || []),
          ...fullNameLengthValidation.errors,
        ];
      }
    }

    // 企業アカウントID
    const companyAccountIdValidation = this.validateRequired(
      data.companyAccountId,
      'Company account ID'
    );
    if (!companyAccountIdValidation.isValid) {
      fieldErrors.companyAccountId = companyAccountIdValidation.errors;
    }

    const hasErrors =
      Object.keys(fieldErrors).length > 0 || generalErrors.length > 0;

    if (hasErrors) {
      logger.debug('Company user registration validation failed', {
        fieldErrors,
        generalErrors,
      });
    }

    return {
      isValid: !hasErrors,
      fieldErrors,
      generalErrors,
    };
  }

  /**
   * ログインデータのバリデート
   */
  validateLoginData(data: {
    email: string;
    password: string;
  }): MultiFieldValidationResult {
    const fieldErrors: Record<string, string[]> = {};
    const generalErrors: string[] = [];

    // メールアドレス
    const emailValidation = this.validateEmail(data.email);
    if (!emailValidation.isValid) {
      fieldErrors.email = emailValidation.errors;
    }

    // パスワード
    const passwordValidation = this.validateRequired(data.password, 'Password');
    if (!passwordValidation.isValid) {
      fieldErrors.password = passwordValidation.errors;
    }

    const hasErrors =
      Object.keys(fieldErrors).length > 0 || generalErrors.length > 0;

    if (hasErrors) {
      logger.debug('Login data validation failed', {
        fieldErrors,
        generalErrors,
      });
    }

    return {
      isValid: !hasErrors,
      fieldErrors,
      generalErrors,
    };
  }
}
