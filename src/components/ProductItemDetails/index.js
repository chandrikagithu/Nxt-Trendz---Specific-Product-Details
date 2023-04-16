// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {Link} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetailList: {},
    apiStatus: apiStatusConstants.initial,
    getItems: 1,
    similarItems: [],
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormatDetails = fetchData => ({
    availability: fetchData.availability,
    brand: fetchData.brand,
    title: fetchData.title,
    totalReviews: fetchData.total_reviews,
    description: fetchData.description,
    id: fetchData.id,
    imageUrl: fetchData.image_url,
    price: fetchData.price,
    rating: fetchData.rating,
  })

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchData = await response.json()

      const updateProductData = this.getFormatDetails(fetchData)

      const updateSimilarProd = fetchData.similar_products.map(eachObj =>
        this.getFormatDetails(eachObj),
      )

      this.setState({
        productDetailList: updateProductData,
        apiStatus: apiStatusConstants.success,
        similarItems: updateSimilarProd,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  getSimilarItems = () => {
    const {productDetailList} = this.state

    const updatelist = productDetailList.similarProducts.map(eachObj => ({
      availability: eachObj.availability,
      brand: eachObj.brand,
      title: eachObj.title,
      totalReviews: eachObj.total_reviews,
      description: eachObj.description,
      id: eachObj.id,
      imageUrl: eachObj.image_url,
      price: eachObj.price,
      rating: eachObj.rating,
    }))
    this.setState({similarItems: updatelist})
  }

  renderRatingContainer = () => {
    const {productDetailList} = this.state
    const {rating, totalReviews} = productDetailList

    return (
      <div className="rating-review-container">
        <div className="rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
            className="star-image"
          />
        </div>
        <p className="review">{totalReviews} Reviews</p>
      </div>
    )
  }

  onIncrementButton = () => {
    this.setState(prevState => ({
      getItems: prevState.getItems + 1,
    }))
  }

  onDecrementButton = () => {
    const {getItems} = this.state
    if (getItems > 1) {
      this.setState(prevState => ({
        getItems: prevState.getItems - 1,
      }))
    }
  }

  getAddToCart = () => {
    const {getItems} = this.state
    return (
      <div>
        <div className="add-item-container">
          <button
            type="button"
            className="add-button"
            onClick={this.onDecrementButton}
            data-testid="minus"
          >
            <BsDashSquare className="add-class-button" />
          </button>
          <p className="get-items">{getItems}</p>
          <button
            type="button"
            className="add-button"
            onClick={this.onIncrementButton}
            data-testid="plus"
          >
            <BsPlusSquare className="add-class-button" />
          </button>
        </div>
        <button type="button" className="add-cart-button">
          ADD TO CART
        </button>
      </div>
    )
  }

  getSimilarProducts = () => {
    const {similarItems} = this.state
    return (
      <div className="similar-container">
        <h1 className="similar">Similar Products</h1>
        <ul className="similar-list">
          {similarItems.map(eachObj => (
            <SimilarProductItem key={eachObj.id} similarDetails={eachObj} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductItemDetails = () => {
    const {productDetailList} = this.state
    const {
      availability,
      brand,
      description,
      imageUrl,
      price,
      title,
    } = productDetailList

    return (
      <>
        <div className="product-similar">
          <div className="product-detail-container">
            <img src={imageUrl} alt="product" className="product-image" />

            <div className="product-info">
              <h1 className="prod-title">{title}</h1>
              <p className="price">Rs {price}/-</p>
              {this.renderRatingContainer()}
              <p className="description">{description}</p>
              <div className="aval-brand">
                <p className="available">Available:</p>
                <p className="avail">{availability}</p>
              </div>
              <div className="aval-brand">
                <p className="available">Brand:</p>
                <p className="avail">{brand}</p>
              </div>

              <hr />
              {this.getAddToCart()}
            </div>
          </div>
          {this.getSimilarProducts()}
        </div>
      </>
    )
  }

  renderFailureProdItem = () => (
    <div className="failure-prod-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="error-image"
      />
      <h1 className="prod-not-found">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="continue-button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderLoader = () => (
    <div data-testid="loader" className="loader-style">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  getAllViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProductItemDetails()
      case apiStatusConstants.failure:
        return this.renderFailureProdItem()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.getAllViews()}
      </>
    )
  }
}
export default ProductItemDetails
