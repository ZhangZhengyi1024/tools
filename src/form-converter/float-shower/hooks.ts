import { useCallback, useState } from 'react';
import { checkFloatPart, floatLength, FloatType, splitFloat } from '../utils';

export interface FloatHook {
  sign: string;
  setSign: React.Dispatch<React.SetStateAction<string>>;
  exponent: string;
  setExponent: React.Dispatch<React.SetStateAction<string>>;
  fraction: string;
  setFraction: React.Dispatch<React.SetStateAction<string>>;
  readonly total: string;
  setTotal: (value: string) => void;
}

export function useFloat(floatType: FloatType): FloatHook {
  const [sign, setSign] = useState('');
  const [exponent, setExponent] = useState('');
  const [fraction, setFraction] = useState('');

  const setTotal = useCallback(
    (value: string) => {
      if (value === '') {
        setSign('');
        setExponent('');
        setFraction('');
      } else if (
        checkFloatPart(value, floatType, 'total') &&
        value.length === floatLength[floatType].total
      ) {
        const [sign, exponent, fraction] = splitFloat(value, floatType);
        setSign(sign);
        setExponent(exponent);
        setFraction(fraction);
      } else {
        throw new Error('Float format error');
      }
    },
    [floatType]
  );

  return {
    sign,
    setSign,
    exponent,
    setExponent,
    fraction,
    setFraction,
    get total() {
      return sign + exponent + fraction;
    },
    setTotal,
  };
}
