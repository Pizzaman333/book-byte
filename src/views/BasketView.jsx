import { useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  clearCart,
  updateQuantity,
} from "../redux/cart/cartSlice";
import {
  selectCartHasItems,
  selectCartLineItems,
  selectCartSubtotal,
} from "../redux/cart/cartSelectors";
import CheckoutModal from "../components/CheckoutModal/CheckoutModal";
import PageHeading from "../components/PageHeading/PageHeading";
import styles from "./BasketView.module.scss";

export default function BasketView() {
  const hasItems = useSelector(selectCartHasItems);
  const items = useSelector(selectCartLineItems);
  const totalPrice = useSelector(selectCartSubtotal);
  const dispatch = useDispatch();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const checkoutButtonRef = useRef(null);

  const openCheckout = () => setIsCheckoutOpen(true);
  const closeCheckout = () => setIsCheckoutOpen(false);

  return (
    <div className={styles.wrapper}>
      <PageHeading text="Your Basket" />

      {!hasItems ? (
        <p className={styles.emptyState}>Your basket is completely empty.</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {items.map((item) => (
              <li key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <h3>{item.title}</h3>
                  <p>${item.price} each</p>
                </div>

                <div className={styles.controlsWrapper}>
                  {/* Quantity Controls */}
                  {/* Quantity Controls */}
                  <div className={styles.quantityControls}>
                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, amount: -1 }))
                      }
                      disabled={item.quantity === 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        dispatch(updateQuantity({ id: item.id, amount: 1 }))
                      }
                    >
                      +
                    </button>
                  </div>

                  {/* Price & Remove */}
                  <div className={styles.priceAndRemove}>
                    <strong>${item.lineTotal.toFixed(2)}</strong>
                    <button
                      className={styles.removeBtn}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Checkout Section */}
          <div className={styles.checkoutSection}>
            <h2>Total: ${totalPrice.toFixed(2)}</h2>

            <div className={styles.actions}>
              <button
                className={styles.clearBtn}
                onClick={() => dispatch(clearCart())}
              >
                Clear Basket
              </button>

              <button
                ref={checkoutButtonRef}
                className={styles.checkoutBtn}
                onClick={openCheckout}
              >
                Checkout
              </button>
            </div>
          </div>
        </>
      )}

      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={items}
        totalPrice={totalPrice}
        onClose={closeCheckout}
        returnFocusRef={checkoutButtonRef}
      />
    </div>
  );
}
