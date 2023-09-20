import React from 'react'
import styled from '@emotion/styled'
import { Rating } from '@mui/material'
import { NavLink } from 'react-router-dom'
import { Avatar } from 'common/Avatar/Avatar'
import { formatDate } from 'utils/formatDate'
export const ReviewItem = ({ author, created_at, property, rate, text }) => {
  return (
    <Wrapper>
      <PropertyBlock>
        <NavLink className='product-link' to={`product/${property.id}`}>
          <img src={property?.images?.[0]?.url} alt={property.name} />
          {property.name}
        </NavLink>
      </PropertyBlock>
      <ReviewBlock>
        <div className='review-info'>
          <Avatar color={'#626ed4'}>{author?.first_name}</Avatar>
          <p>{author?.first_name}</p>
          <p className='reviews-date'>{formatDate(created_at)}</p>
        </div>
        <Rating name='half-rating-read' precision={0.5} value={rate} readOnly />
        <p>{text}</p>
      </ReviewBlock>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  width: 350px;
  min-height: 350px;
  padding: 16px;
  box-shadow: 0 5px 10px rgba(26, 54, 95, 0.1);
  background-color: #fff;
  border-radius: 20px;
  margin: 10px;
`

const PropertyBlock = styled.div`
  border-bottom: 1px solid rgba(136, 143, 154, 0.16);
  padding: 10px 0;
  & img {
    width: 50px;
    height: auto;
    display: block;
  }
  & .product-link {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`
const ReviewBlock = styled.div`
  & .review-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }
  & .reviews-date {
    font-weight: 400;
    font-size: 14px;
    line-height: 1.12;
    color: rgba(57, 69, 86, 0.6);
  }
`
