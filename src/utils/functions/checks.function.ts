function isNullOrUndefined (value: any): boolean {
  return value === null || value === undefined
}

function isNullAndUndefined (value: any): boolean {
  return value === null && value === undefined
}

function isNotNullOrUndefined (value: any): boolean {
  return value !== null || value !== undefined
}

function isNotNullAndUndefined (value: any): boolean {
  return value !== null && value !== undefined
}

export {
  isNullOrUndefined,
  isNullAndUndefined,
  isNotNullOrUndefined,
  isNotNullAndUndefined
}
