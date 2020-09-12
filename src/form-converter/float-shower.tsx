import { Input } from 'antd';
import React, { ChangeEventHandler, FC, useEffect, useRef, useState } from 'react';
import './float-shower.less';
import { checkFloatPart, FloatType, splitFloat } from './utils';

interface FloatShowerCommonProp {
  value: string;
  floatType: FloatType;
}

type FloatShowerProp = (
  | { inputMode: true; onInputChange: (input: string) => void }
  | { inputMode: false }
) &
  FloatShowerCommonProp;

export const FloatShower: FC<FloatShowerProp> = props => {
  const { floatType, inputMode } = props;
  const [sign, setSign] = useState('');
  const [exponent, setExponent] = useState('');
  const [fraction, setFraction] = useState('');
  const inputUpdatedRef = useRef(false);

  useEffect(() => {
    const [sign, exponent, fraction] = splitFloat(props.value, floatType);
    setSign(sign);
    setExponent(exponent);
    setFraction(fraction);
  }, [props.value, floatType]);

  useEffect(() => {
    if (inputUpdatedRef.current && props.inputMode) {
      inputUpdatedRef.current = false;
      props.onInputChange(sign + exponent + fraction);
    }
  }, [sign, exponent, fraction, props, floatType]);

  const handleSignChange: ChangeEventHandler<HTMLInputElement> = e => {
    const part = e.target.value;
    if (checkFloatPart(part, props.floatType, 'sign')) {
      setSign(part);
      inputUpdatedRef.current = true;
    }
  };

  const handleExponentChange: ChangeEventHandler<HTMLInputElement> = e => {
    const part = e.target.value;
    if (checkFloatPart(part, props.floatType, 'exponent')) {
      setExponent(part);
      inputUpdatedRef.current = true;
    }
  };

  const handleFractionChange: ChangeEventHandler<HTMLInputElement> = e => {
    const part = e.target.value;
    if (checkFloatPart(part, floatType, 'fraction')) {
      setFraction(part);
      inputUpdatedRef.current = true;
    }
  };

  return inputMode ? (
    <div className="float-shower-input">
      <Input className="sign" value={sign} onChange={handleSignChange} />
      <Input
        className="exponent addon-after"
        value={exponent}
        onChange={handleExponentChange}
        addonAfter={<span className="input-length">{exponent.length}</span>}
        allowClear
      />
      <Input
        className="fraction addon-after"
        value={fraction}
        onChange={handleFractionChange}
        addonAfter={<span className="input-length">{fraction.length}</span>}
        allowClear
      />
    </div>
  ) : (
    <div className="float-shower-output">
      <Input className="sign" value={sign} />
      <Input className="exponent" value={exponent} />
      <Input className="fraction" value={fraction} />
    </div>
  );
};