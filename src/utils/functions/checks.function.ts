function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

function isNullAndUndefined(value: any): boolean {
  return value === null && value === undefined;
}

function isNotNullOrUndefined(value: any): boolean {
  return value !== null || value !== undefined;
}

function isNotNullAndUndefined(value: any): boolean {
  return value !== null && value !== undefined;
}

function isBase64(str) {
  if (typeof str !== 'string') {
      return false;
  }

  // Verifica se o comprimento é múltiplo de 4 e se corresponde ao padrão base64
  const base64Regex = /^(?:[A-Za-z0-9+\/]{4})*?(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
  return base64Regex.test(str);
}

export {
  isNullOrUndefined,
  isNullAndUndefined,
  isNotNullOrUndefined,
  isNotNullAndUndefined,
  isBase64
};
