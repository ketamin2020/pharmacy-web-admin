import React from 'react'
import { useDispatch } from 'react-redux'
import { priceToView } from 'utils/priceToView'
import Button from 'common/Button/Button'
import img from '../../mockDev/product.png'
import { FavoriteBorder, ShoppingBasket } from '@material-ui/icons'
import { ContentWrapper, ImageWrapper, Wrapper } from './ProductCard.styles'
import { useNavigate } from 'react-router-dom'
import { RoutePath } from 'routes/types'
import { postNewWish, deleteWishItem, fetchWishList, fetchWishListByUser } from 'redux/wish/wishOperation'
import { postNewBasket, deleteBasketItem, fetchBasketList, fetchBasketListByUser } from 'redux/basket/basketOperation'
import { useSelector } from 'react-redux'
import { wishlistIdsSelector } from 'redux/wish/wishSelectors'
import { Favorite } from '@mui/icons-material'
import { basketlistIdsSelector } from 'redux/basket/basketSelectors'
import { Rating } from '@mui/material'
import { Comment } from '@material-ui/icons'
interface IProductCard {
  name: string
  status: string
  price: number
  image: string
  id: string
  reviews: []
  callback: () => void
}

const ProductCard = ({ name, status, price, image, id, callback, reviews }: IProductCard) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const wishesArrayIds = useSelector(wishlistIdsSelector)
  const basketArrayIds = useSelector(basketlistIdsSelector)
  const handleNavigate = () => {
    navigate(`${RoutePath.PRODUCT}/${id}`)
  }

  const handleAddToWishList = id => {
    dispatch(postNewWish(id))
    dispatch(fetchWishList())
    dispatch(fetchWishListByUser())
    callback?.()
  }

  const handleDeleteFromWishList = id => {
    dispatch(deleteWishItem(id))
    dispatch(fetchWishList())
    dispatch(fetchWishListByUser())
    callback?.()
  }
  const handleAddToBasketList = async id => {
    await dispatch(postNewBasket(id))
    await dispatch(fetchBasketList())
    await dispatch(fetchBasketListByUser())
  }

  const handleDeleteFromBasketList = async id => {
    await dispatch(deleteBasketItem(id))
    await dispatch(fetchBasketList())
    await dispatch(fetchBasketListByUser())
  }

  return (
    <Wrapper>
      <ImageWrapper>
        <img src={image || img} alt='' />
        {wishesArrayIds?.includes(id) ? (
          <span onClick={() => handleDeleteFromWishList(id)} className='favorite-icon'>
            <Favorite htmlColor='red' />
          </span>
        ) : (
          <span onClick={() => handleAddToWishList(id)} className='favorite-icon'>
            <FavoriteBorder />
          </span>
        )}
      </ImageWrapper>
      <ContentWrapper>
        {!!reviews?.length ? (
          <>
            <Rating
              name='half-rating-read'
              precision={0.5}
              value={reviews?.reduce((acc, item) => (acc += +item?.rate), 0)}
              readOnly
            />
            <p className='review-count'>{`${reviews?.length} відгуків`}</p>
          </>
        ) : (
          <div className='review-empty'>
            <Comment />
            <p className='' onClick={handleNavigate}>
              Залишити відгук
            </p>
          </div>
        )}

        <p onClick={handleNavigate} className='product-name'>
          {name}
        </p>
        <p className='product-price'>{priceToView(price)}</p>
        <p className='product-status'>{status}</p>
        {basketArrayIds?.includes(id) ? (
          <Button
            onClick={() => handleDeleteFromBasketList(id)}
            color='green'
            shape='square'
            buttonCustomClass='product-basket'
          >
            <p>
              <ShoppingBasket /> Видалити з кошика
            </p>
          </Button>
        ) : (
          <Button
            onClick={() => handleAddToBasketList(id)}
            color='green'
            shape='square'
            buttonCustomClass='product-basket'
          >
            <p>
              <ShoppingBasket /> Добавити в кошик
            </p>
          </Button>
        )}
      </ContentWrapper>
    </Wrapper>
  )
}

export { ProductCard, IProductCard }
