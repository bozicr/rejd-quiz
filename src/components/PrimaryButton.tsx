import React from 'react';
import styles from 'styles/components/PrimaryButton.module.scss';
import { PrimaryButtonProps } from '../types/ComponentTypes';

function PrimaryButton({ children, onClick, disabled }: PrimaryButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled} className={styles.primaryButton}>
      {children}
    </button>
  );
}

export default PrimaryButton;
