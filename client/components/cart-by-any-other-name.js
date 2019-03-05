import React from 'react'
import {connect} from 'react-redux'
import {getCartItems, editItem, deleteItem} from '../store/orderProduct'
import axios from 'axios'

class Cart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      guestCart: JSON.parse(localStorage.getItem('guestCart'))
    }
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.props.loadCartItems(this.props.cart.id)
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate got triggered')
    if (this.props.cart !== prevProps.cart && this.props.isLoggedIn) {
      this.props.loadCartItems(this.props.cart.id)
    }
    if (this.props.items !== prevProps.items) {
      console.log('items changed', this.props.items)
    }
  }

  async handleSubmit(evt) {
    const shippingAddress = evt.target.shippingAddress.value
    const billingAddress = evt.target.billingAddress.value
    if (this.props.isLoggedIn) {
      const id = this.props.cart.id
      try {
        await axios.put('/api/orders/checkout', {
          id,
          shippingAddress,
          billingAddress
        })
        alert('Your order has been placed')
      } catch (err) {
        console.log(err)
      }
    } else {
      alert('You have to be logged in to checkout!')
    }
  }

  handleChange(evt, productId) {
    const newQuant = evt.target.value
    if (this.props.isLoggedIn) {
      this.props.updateQuantity(newQuant, productId)
    }
    // then do guestCart
  }

  handleDeleteItem(evt, productId) {
    if (this.props.isLoggedIn) {
      this.props.removeFromCart(productId)
    }
  }

  render() {
    console.log('render triggered')
    let cartItems
    if (this.props.items && this.props.items.length) {
      cartItems = this.props.items
    } else if (this.state.guestCart.length !== 0 && !this.props.isLoggedIn) {
      cartItems = this.state.guestCart
    } else {
      return <h3>Your cart is empty!</h3>
    }
    return (
      <div>
        <h1>Cart</h1>
        <div>
          {cartItems.map(item => (
            <div key={item.productId}>
              <h3>{item.product.name}</h3>
              <img src={item.product.imageUrl} width="200px" />
              <label>Quantity: </label>
              <select
                value={item.quantity}
                onChange={event => this.handleChange(event, item.productId)}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
              <p>Price: ${item.product.price}</p>
              <button
                type="button"
                onClick={event => this.handleDeleteItem(event, item.productId)}
              >
                Remove from cart
              </button>
            </div>
          ))}
        </div>
        <div>
          <h3>Total Cost: </h3>
          <p>
            ${cartItems.reduce(function(accum, currVal) {
              return accum + Number(currVal.product.price)
            }, 0)}
          </p>
        </div>
        <div>
          <form onSubmit={this.handleSubmit}>
            <label>Shipping Address:</label>
            <input type="text" name="shippingAddress" />
            <label>Billing Address:</label>
            <input type="text" name="billingAddress" />
            <br />
            <button type="submit">Checkout</button>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log('mapStateToProps gets triggered')
  return {
    items: state.orderProduct.items, // Rows from OrderProduct table
    cart: state.orders.cart, // Row from Order table
    isLoggedIn: !!state.user.id
  }
}

const mapDispatchToProps = dispatch => ({
  loadCartItems: orderId => dispatch(getCartItems(orderId)),
  updateQuantity: (quantity, productId) =>
    dispatch(editItem(quantity, productId)),
  removeFromCart: productId => dispatch(deleteItem(productId))
})

export default connect(mapStateToProps, mapDispatchToProps)(Cart)

// adding fake text to create change.
