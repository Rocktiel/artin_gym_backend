// DTO alanları
export enum DtoField {
  NAME = 'NAME',
  LASTNAME = 'LASTNAME',
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
  AGE = 'AGE',
  PHONE = 'PHONE',
  USER_TYPE = 'USER_TYPE',
  PRICE = 'PRICE',
  DESCRIPTION = 'DESCRIPTION',
  DAY = 'DAY',
  START_TIME = 'START_TIME',
  END_TIME = 'END_TIME',
  TENANT_NAME = 'TENANT_NAME',
  USERNAME = 'USERNAME',
  ADDRESS = 'ADDRESS',
}

// Doğrulama türleri
export enum ValidationMessage {
  IS_NOT_EMPTY = 'CANNOT_BE_EMPTY',
  MUST_BE_STRING = 'MUST_BE_STRING',
  MUST_BE_NUMBER = 'MUST_BE_NUMBER',
  MIN_LENGTH = 'MIN_LENGTH',
  MAX_LENGTH = 'MAX_LENGTH',
  IS_EMAIL = 'MUST_BE_VALID_EMAIL',
  IS_DATE = 'MUST_BE_VALID_DATE',
  IS_STRONG_PASSWORD = 'IS_STRONG_PASSWORD',
  NOT_VALID = 'NOT_VALID',
  MUST_BE_EMAIL = 'MUST_BE_EMAIL',
  IS_STRING = 'IS_STRING',
}

export function getValidationMessage(
  field: DtoField,
  type: ValidationMessage,
  dynamicValue?: number | Record<string, any>,
): string {
  let message = `${field} ${type}`;

  if (typeof dynamicValue === 'number') {
    message = message.replace('{value}', dynamicValue.toString());
  }

  if (typeof dynamicValue === 'object' && dynamicValue !== null) {
    Object.keys(dynamicValue).forEach((key) => {
      message = message.replace(`{${key}}`, dynamicValue[key]);
    });
  }

  return message;
}
