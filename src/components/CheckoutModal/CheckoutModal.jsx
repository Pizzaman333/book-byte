import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { clearCart } from "../../redux/cart/cartSlice";
import styles from "./CheckoutModal.module.scss";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  country: "",
  cardholderName: "",
  cardNumber: "",
  expiry: "",
  cvv: "",
};

function formatCardNumber(value) {
  return value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value) {
  const digits = value.replace(/\D/g, "").slice(0, 4);

  if (digits.length < 3) {
    return digits;
  }

  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function validateForm(values) {
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = "Enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Enter your email.";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!values.address.trim()) errors.address = "Enter your address.";
  if (!values.city.trim()) errors.city = "Enter your city.";
  if (!values.postalCode.trim()) {
    errors.postalCode = "Enter your postal code.";
  } else if (values.postalCode.trim().length < 4) {
    errors.postalCode = "Postal code is too short.";
  }

  if (!values.country.trim()) errors.country = "Enter your country.";
  if (!values.cardholderName.trim()) {
    errors.cardholderName = "Enter the cardholder name.";
  }

  const rawCardNumber = values.cardNumber.replace(/\D/g, "");
  if (!rawCardNumber) {
    errors.cardNumber = "Enter your card number.";
  } else if (rawCardNumber.length !== 16) {
    errors.cardNumber = "Card number must be 16 digits.";
  }

  if (!values.expiry.trim()) {
    errors.expiry = "Enter the expiry date.";
  } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiry)) {
    errors.expiry = "Use MM/YY format.";
  }

  const rawCvv = values.cvv.replace(/\D/g, "");
  if (!rawCvv) {
    errors.cvv = "Enter the CVV.";
  } else if (rawCvv.length < 3) {
    errors.cvv = "CVV must be at least 3 digits.";
  }

  return errors;
}

export default function CheckoutModal({
  isOpen,
  items,
  totalPrice,
  onClose,
  returnFocusRef,
}) {
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const firstInputRef = useRef(null);
  const modalCardRef = useRef(null);
  const previousActiveElementRef = useRef(null);

  const currentErrors = useMemo(() => validateForm(formValues), [formValues]);
  const hasValidationErrors = Object.keys(currentErrors).length > 0;

  useEffect(() => {
    if (hasSubmitted) {
      setErrors(currentErrors);
    }
  }, [currentErrors, hasSubmitted]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previousActiveElementRef.current = document.activeElement;
    const focusTarget = returnFocusRef?.current || previousActiveElementRef.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        if (isSuccess) {
          dispatch(clearCart());
          onClose();
        } else {
          onClose();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    window.setTimeout(() => {
      if (isSuccess) {
        modalCardRef.current?.focus();
      } else {
        firstInputRef.current?.focus();
      }
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);

      if (focusTarget && typeof focusTarget.focus === "function") {
        focusTarget.focus();
      }
    };
  }, [dispatch, isOpen, isSuccess, onClose, returnFocusRef]);

  useEffect(() => {
    if (!isOpen) {
      setFormValues(INITIAL_FORM);
      setErrors({});
      setHasSubmitted(false);
      setIsSubmitting(false);
      setIsSuccess(false);
    }
  }, [isOpen]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let nextValue = value;

    if (name === "cardNumber") {
      nextValue = formatCardNumber(value);
    }

    if (name === "expiry") {
      nextValue = formatExpiry(value);
    }

    if (name === "cvv") {
      nextValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormValues((current) => ({
      ...current,
      [name]: nextValue,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHasSubmitted(true);
    setErrors(currentErrors);

    if (Object.keys(currentErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    setIsSubmitting(false);
    setIsSuccess(true);
  };

  const handleSuccessDismiss = () => {
    dispatch(clearCart());
    onClose();
  };

  const handleRequestClose = () => {
    if (isSuccess) {
      handleSuccessDismiss();
      return;
    }

    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className={styles.overlay}
      onClick={handleRequestClose}
    >
      <div
        ref={modalCardRef}
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="checkout-modal-title"
        tabIndex={-1}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={handleRequestClose}
          aria-label="Close checkout modal"
        >
          ×
        </button>

        {isSuccess ? (
          <div className={styles.successState}>
            <p className={styles.successEyebrow}>Order confirmed</p>
            <h2 id="checkout-modal-title">Your books are on the way.</h2>
            <p className={styles.successMessage}>
              Payment was processed successfully for ${totalPrice.toFixed(2)}.
            </p>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={handleSuccessDismiss}
            >
              Finish
            </button>
          </div>
        ) : (
          <>
            <div className={styles.header}>
              <p className={styles.eyebrow}>Checkout</p>
              <h2 id="checkout-modal-title">Complete your payment</h2>
              <p className={styles.subtitle}>
                Review your basket and enter shipping and payment details.
              </p>
            </div>

            <div className={styles.content}>
              <section className={styles.summaryPanel}>
                <h3>Order summary</h3>
                <ul className={styles.summaryList}>
                  {items.map((item) => (
                    <li key={item.id} className={styles.summaryItem}>
                      <div>
                        <strong>{item.title}</strong>
                        <span>
                          Qty {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                      <strong>${item.lineTotal.toFixed(2)}</strong>
                    </li>
                  ))}
                </ul>

                <div className={styles.summaryTotal}>
                  <span>Total</span>
                  <strong>${totalPrice.toFixed(2)}</strong>
                </div>
              </section>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <div className={styles.formSection}>
                  <h3>Contact</h3>
                  <label className={styles.field}>
                    <span>Full name</span>
                    <input
                      ref={firstInputRef}
                      name="fullName"
                      value={formValues.fullName}
                      onChange={handleChange}
                      autoComplete="name"
                    />
                    {hasSubmitted && errors.fullName && (
                      <small>{errors.fullName}</small>
                    )}
                  </label>

                  <label className={styles.field}>
                    <span>Email</span>
                    <input
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                      autoComplete="email"
                    />
                    {hasSubmitted && errors.email && <small>{errors.email}</small>}
                  </label>
                </div>

                <div className={styles.formSection}>
                  <h3>Shipping</h3>
                  <label className={styles.field}>
                    <span>Address</span>
                    <input
                      name="address"
                      value={formValues.address}
                      onChange={handleChange}
                      autoComplete="street-address"
                    />
                    {hasSubmitted && errors.address && (
                      <small>{errors.address}</small>
                    )}
                  </label>

                  <div className={styles.fieldRow}>
                    <label className={styles.field}>
                      <span>City</span>
                      <input
                        name="city"
                        value={formValues.city}
                        onChange={handleChange}
                        autoComplete="address-level2"
                      />
                      {hasSubmitted && errors.city && <small>{errors.city}</small>}
                    </label>

                    <label className={styles.field}>
                      <span>Postal code</span>
                      <input
                        name="postalCode"
                        value={formValues.postalCode}
                        onChange={handleChange}
                        autoComplete="postal-code"
                      />
                      {hasSubmitted && errors.postalCode && (
                        <small>{errors.postalCode}</small>
                      )}
                    </label>
                  </div>

                  <label className={styles.field}>
                    <span>Country</span>
                    <input
                      name="country"
                      value={formValues.country}
                      onChange={handleChange}
                      autoComplete="country-name"
                    />
                    {hasSubmitted && errors.country && (
                      <small>{errors.country}</small>
                    )}
                  </label>
                </div>

                <div className={styles.formSection}>
                  <h3>Payment</h3>
                  <label className={styles.field}>
                    <span>Cardholder name</span>
                    <input
                      name="cardholderName"
                      value={formValues.cardholderName}
                      onChange={handleChange}
                      autoComplete="cc-name"
                    />
                    {hasSubmitted && errors.cardholderName && (
                      <small>{errors.cardholderName}</small>
                    )}
                  </label>

                  <label className={styles.field}>
                    <span>Card number</span>
                    <input
                      name="cardNumber"
                      value={formValues.cardNumber}
                      onChange={handleChange}
                      autoComplete="cc-number"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                    />
                    {hasSubmitted && errors.cardNumber && (
                      <small>{errors.cardNumber}</small>
                    )}
                  </label>

                  <div className={styles.fieldRow}>
                    <label className={styles.field}>
                      <span>Expiry</span>
                      <input
                        name="expiry"
                        value={formValues.expiry}
                        onChange={handleChange}
                        autoComplete="cc-exp"
                        inputMode="numeric"
                        placeholder="MM/YY"
                      />
                      {hasSubmitted && errors.expiry && (
                        <small>{errors.expiry}</small>
                      )}
                    </label>

                    <label className={styles.field}>
                      <span>CVV</span>
                      <input
                        name="cvv"
                        value={formValues.cvv}
                        onChange={handleChange}
                        autoComplete="cc-csc"
                        inputMode="numeric"
                        placeholder="123"
                      />
                      {hasSubmitted && errors.cvv && <small>{errors.cvv}</small>}
                    </label>
                  </div>
                </div>

                <div className={styles.actions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={handleRequestClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className={styles.primaryButton}
                    disabled={isSubmitting || (hasSubmitted && hasValidationErrors)}
                  >
                    {isSubmitting ? "Processing..." : "Confirm order"}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
