import React from 'react'
import {connect} from 'react-redux'
import {getOneProductThunk} from '../store/allProducts'
import {Link} from 'react-router-dom'
import axios from 'axios'

class SingleProduct extends React.Component {
  constructor(props) {
    super(props)
    this.state = {value: '1'}
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    const productId = this.props.match.params.productId
    this.props.loadOneDuck(productId)
  }

  handleChange(evt) {
    this.setState({value: evt.target.value})
  }

  async handleSubmit(evt) {
    evt.preventDefault()
    const quantity = this.state.value
    if (this.props.isLoggedIn) {
      try {
        const item = await axios.post('/api/orderProducts', {
          productId: this.props.currentProduct.id,
          orderId: this.props.cart.id,
          quantity
        })
        alert(
          `${this.state.value} of the item ${
            this.props.currentProduct.name
          } added to cart!`
        )
      } catch (err) {
        console.log(err)
      }
    } else {
      const item = {
        productId: this.props.currentProduct.id,
        quantity,
        product: this.props.currentProduct
      }
      const guestCart = JSON.parse(localStorage.getItem('guestCart'))
      if (guestCart.length === 0) {
        guestCart.push(item)
      } else {
        for (let i = 0; i < guestCart.length; i++) {
          if (guestCart[i].productId === item.productId) {
            guestCart[i].quantity = item.quantity
            break
          } else if (i === guestCart.length - 1) {
            guestCart.push(item)
          }
        }
      }
      localStorage.setItem('guestCart', JSON.stringify(guestCart))
    }
  }

  render() {
    const currentProduct = this.props.currentProduct
    return (
      <div className="oneProduct">
        <img
          src={currentProduct.imageUrl}
          width="400px"
          height="400px"
          className="duckPic"
        />
        <div className="productInfo">
          <h3>{currentProduct.name}</h3>
          <p className="price">${currentProduct.price}</p>
          <p className="description">{currentProduct.description}</p>
          <form onSubmit={this.handleSubmit}>
            <select value={this.state.value} onChange={this.handleChange}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
            <button className="addToCart" type="submit">
              Add to cart
            </button>
          </form>
        </div>
        <p />
        <Link to="/products" className="backToProducts">
          Back to all Producks
        </Link>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentProduct: state.products.currentProduct,
    cart: state.orders.cart,
    isLoggedIn: !!state.user.id
  }
}

const mapDispatchToProps = dispatch => ({
  loadOneDuck: function(productId) {
    dispatch(getOneProductThunk(productId))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(SingleProduct)
