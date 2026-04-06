import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { FiCheck, FiLock, FiShoppingBag, FiCreditCard, FiUser, FiMapPin } from 'react-icons/fi'
import useCart from '../hooks/useCart'
import { formatPrice, calculateCartTotals } from '../utils/helpers'
import './Checkout.css'

// Yup validation schema
const schema = yup.object({
  firstName: yup.string().required('First name is required').min(2, 'Too short'),
  lastName: yup.string().required('Last name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  zip: yup.string().required('ZIP code is required'),
  cardName: yup.string().required('Name on card is required'),
  cardNumber: yup
    .string()
    .required('Card number is required')
    .matches(/^\d{16}$/, 'Must be 16 digits'),
  expiry: yup.string().required('Expiry is required').matches(/^\d{2}\/\d{2}$/, 'Format: MM/YY'),
  cvv: yup.string().required('CVV is required').matches(/^\d{3,4}$/, '3-4 digits'),
})

const Checkout = () => {
  const { cartItems, clearCart } = useCart()
  const navigate = useNavigate()
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const { subtotal, tax, shipping, total } = calculateCartTotals(cartItems)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async () => {
    await new Promise((res) => setTimeout(res, 1500))
    setOrderPlaced(true)
    clearCart()
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🛍️</div>
            <h3>No items to checkout</h3>
            <p>Add some products to your cart first.</p>
            <Link to="/products" className="btn btn-primary">Shop Now</Link>
          </div>
        </div>
      </div>
    )
  }

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="container">
          <motion.div
            className="order-success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <div className="success-icon-wrap">
              <motion.div
                className="success-icon"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
              >
                <FiCheck size={40} />
              </motion.div>
            </div>
            <h2>Order Placed Successfully! 🎉</h2>
            <p>Thank you for your purchase. You'll receive a confirmation email shortly.</p>
            <div className="success-order-id">
              Order #{Math.random().toString(36).slice(2, 10).toUpperCase()}
            </div>
            <div className="success-btns">
              <Link to="/" className="btn btn-primary">Back to Home</Link>
              <Link to="/products" className="btn btn-outline">Continue Shopping</Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <div className="checkout-header">
          <h1 className="section-title">
            <FiLock size={22} style={{ color: 'var(--color-primary-light)' }} /> Secure Checkout
          </h1>
          <p className="section-subtitle">Your information is encrypted and secure</p>
        </div>

        <div className="checkout-layout">
          {/* Form */}
          <form className="checkout-form" onSubmit={handleSubmit(onSubmit)} id="checkout-form">
            {/* Personal Info */}
            <div className="form-section">
              <div className="form-section-title">
                <FiUser size={16} /> Personal Information
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>First Name</label>
                  <input {...register('firstName')} className="input" placeholder="John" id="checkout-firstname" />
                  {errors.firstName && <span className="form-error">{errors.firstName.message}</span>}
                </div>
                <div className="form-field">
                  <label>Last Name</label>
                  <input {...register('lastName')} className="input" placeholder="Doe" id="checkout-lastname" />
                  {errors.lastName && <span className="form-error">{errors.lastName.message}</span>}
                </div>
                <div className="form-field">
                  <label>Email</label>
                  <input {...register('email')} className="input" placeholder="john@email.com" type="email" id="checkout-email" />
                  {errors.email && <span className="form-error">{errors.email.message}</span>}
                </div>
                <div className="form-field">
                  <label>Phone</label>
                  <input {...register('phone')} className="input" placeholder="+1 234 567 8900" id="checkout-phone" />
                  {errors.phone && <span className="form-error">{errors.phone.message}</span>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="form-section">
              <div className="form-section-title">
                <FiMapPin size={16} /> Shipping Address
              </div>
              <div className="form-field">
                <label>Street Address</label>
                <input {...register('address')} className="input" placeholder="123 Main Street" id="checkout-address" />
                {errors.address && <span className="form-error">{errors.address.message}</span>}
              </div>
              <div className="form-grid-3">
                <div className="form-field">
                  <label>City</label>
                  <input {...register('city')} className="input" placeholder="New York" id="checkout-city" />
                  {errors.city && <span className="form-error">{errors.city.message}</span>}
                </div>
                <div className="form-field">
                  <label>State</label>
                  <input {...register('state')} className="input" placeholder="NY" id="checkout-state" />
                  {errors.state && <span className="form-error">{errors.state.message}</span>}
                </div>
                <div className="form-field">
                  <label>ZIP Code</label>
                  <input {...register('zip')} className="input" placeholder="10001" id="checkout-zip" />
                  {errors.zip && <span className="form-error">{errors.zip.message}</span>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="form-section">
              <div className="form-section-title">
                <FiCreditCard size={16} /> Payment Details
              </div>
              <div className="form-field">
                <label>Name on Card</label>
                <input {...register('cardName')} className="input" placeholder="John Doe" id="checkout-cardname" />
                {errors.cardName && <span className="form-error">{errors.cardName.message}</span>}
              </div>
              <div className="form-field">
                <label>Card Number</label>
                <input {...register('cardNumber')} className="input" placeholder="1234 5678 9012 3456" maxLength={16} id="checkout-cardnumber" />
                {errors.cardNumber && <span className="form-error">{errors.cardNumber.message}</span>}
              </div>
              <div className="form-grid-2">
                <div className="form-field">
                  <label>Expiry Date</label>
                  <input {...register('expiry')} className="input" placeholder="MM/YY" id="checkout-expiry" />
                  {errors.expiry && <span className="form-error">{errors.expiry.message}</span>}
                </div>
                <div className="form-field">
                  <label>CVV</label>
                  <input {...register('cvv')} className="input" placeholder="123" maxLength={4} id="checkout-cvv" />
                  {errors.cvv && <span className="form-error">{errors.cvv.message}</span>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg place-order-btn"
              disabled={isSubmitting}
              id="place-order-btn"
            >
              {isSubmitting ? (
                <span className="btn-loading">Processing... ⏳</span>
              ) : (
                <>
                  <FiLock size={16} /> Place Order — {formatPrice(total)}
                </>
              )}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout-summary">
            <h3 className="summary-title">
              <FiShoppingBag size={16} /> Order Summary
            </h3>

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.productId} className="checkout-item">
                  <img src={item.image} alt={item.title} className="checkout-item-img" loading="lazy" />
                  <div className="checkout-item-info">
                    <span className="checkout-item-title">{item.title}</span>
                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="checkout-item-price">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="checkout-totals">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span className={shipping === 0 ? 'free-shipping' : ''}>
                  {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                </span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>{formatPrice(tax)}</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
