import wppConstants from '../constants/wpp.constant';

function addUsWpp(number: string): string {
  return number + wppConstants.usWpp;
}

function handledMessage(message: string, params: string[]): string {
  return params.reduce((acc, cur, idx) => {
    const pattern = new RegExp(`{#${idx + 1}#}`, 'g');
    return acc.replace(pattern, cur);
  }, message);
}

export { addUsWpp, handledMessage };
