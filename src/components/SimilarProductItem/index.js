import './index.css'

const SimilarProductItem = props => {
  const {similarDetails} = props
  const {imageUrl, brand, price, rating, title} = similarDetails
  return (
    <li className="similar-prod-list">
      <img src={imageUrl} alt="similar product" className="list-image" />
      <h1 className="short-title">{title}</h1>
      <p className="short-brand">by {brand}</p>
      <div className="price-rating">
        <p className="rupees">Rs {price}/-</p>
        <div className="rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png "
            alt="star"
            className="star-image"
          />
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem
