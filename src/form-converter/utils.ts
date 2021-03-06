import { ChangeEventHandler } from 'react';

export type FloatType =
  | 'f32' // 2 进制表示的 32 位浮点数
  | 'f64'; // 2 进制表示的 64 位浮点数

export type ModeOfNumber =
  | 'd' // 10 进制整数或小数
  | FloatType;

export type FloatPartType = 'sign' | 'exponent' | 'fraction' | 'total';

/**
 * 将表示数字的字符串转换成另一种格式
 * @param input 表示数字的字符串
 * @param inputMode 输入字符串的格式
 * @param resultMode 输出字符串的格式
 * @returns 返回转换结果，输入为空时返回`空字符串`，输入无效时返回 `null`
 */
export function convertFormOfNumber(
  input: string,
  inputMode: ModeOfNumber,
  resultMode: ModeOfNumber
): string | null {
  if (input === '') return '';

  const buffer = new ArrayBuffer(8);
  const dv = new DataView(buffer);

  let num: number;
  switch (inputMode) {
    case 'd':
      num = Number(input);
      if (isNaN(num) && !/^[-+]?NaN$/.test(input)) return null;
      break;
    case 'f32':
      if (!/^[01]{32}$/.test(input)) return null;
      dv.setUint32(0, Number.parseInt(input, 2));
      num = dv.getFloat32(0);
      break;
    case 'f64':
      if (!/^[01]{64}$/.test(input)) return null;
      dv.setUint32(0, Number.parseInt(input.slice(0, 32), 2));
      dv.setUint32(4, Number.parseInt(input.slice(32), 2));
      num = dv.getFloat64(0);
      break;
  }

  switch (resultMode) {
    case 'd':
      return num.toString();
    case 'f32':
      dv.setFloat32(0, Math.fround(num));
      return dv.getUint32(0).toString(2).padStart(32, '0');
    case 'f64':
      dv.setFloat64(0, num);
      return dv.getBigUint64(0).toString(2).padStart(64, '0');
  }
}

export const floatLength: Record<FloatType, Record<FloatPartType, number>> = {
  f32: { total: 32, sign: 1, exponent: 8, fraction: 23 },
  f64: { total: 64, sign: 1, exponent: 11, fraction: 52 },
};

const floatRegExp: Record<FloatType, Record<FloatPartType, RegExp>> = {
  f32: {
    sign: /^[01]{0,1}$/,
    exponent: /^[01]{0,8}$/,
    fraction: /^[01]{0,23}$/,
    total: /^[01]{0,32}$/,
  },
  f64: {
    sign: /^[01]{0,1}$/,
    exponent: /^[01]{0,11}$/,
    fraction: /^[01]{0,52}$/,
    total: /^[01]{0,64}$/,
  },
};

export function splitFloat(
  value: string,
  floatType: FloatType
): [string, string, string] {
  switch (floatType) {
    case 'f32':
      return [value.slice(0, 1), value.slice(1, 9), value.slice(9)];
    case 'f64':
      return [value.slice(0, 1), value.slice(1, 12), value.slice(12)];
  }
}

export function checkFloatPart(
  part: string,
  floatType: FloatType,
  floatPartType: FloatPartType
): boolean {
  return floatRegExp[floatType][floatPartType].test(part);
}

export function onInputChangeWrapper(
  fn: (input: string) => void
): ChangeEventHandler<HTMLInputElement> {
  return e => fn(e.target.value);
}
