import React from "react";
// eslint-disable-next-line no-unused-vars -- `motion` is used as <motion.*> in JSX
import { motion, AnimatePresence } from "motion/react";
import { MinusIcon, PlusIcon } from "lucide-react";
import styles from "./Quantity.module.css";

const spring = { type: "spring", stiffness: 400, damping: 17 };

export function QuantityIncrease({ max, value, className = "", children, ...props }) {
  const disabled = max !== undefined && value !== undefined && value >= max;
  return (
    <motion.button
      type="button"
      aria-label="Increase quantity"
      className={`${styles.btn} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={spring}
      {...props}
    >
      {children || <PlusIcon size={16} />}
    </motion.button>
  );
}

export function QuantityDecrease({ min = 1, value, className = "", children, ...props }) {
  const disabled = value !== undefined && value <= min;
  return (
    <motion.button
      type="button"
      aria-label="Decrease quantity"
      className={`${styles.btn} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.08 }}
      whileTap={disabled ? undefined : { scale: 0.92 }}
      transition={spring}
      {...props}
    >
      {children || <MinusIcon size={16} />}
    </motion.button>
  );
}

export function QuantityValue({ className = "", children, ...props }) {
  return (
    <div className={`${styles.value} ${className}`} {...props}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={String(children)}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export default QuantityValue;
