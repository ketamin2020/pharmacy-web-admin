import styled from '@emotion/styled'
const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  /* justify-content: space-between; */
  position: relative;
  padding: 10px;
  border-radius: 30px;
  box-shadow: 0 5px 10px rgb(26 54 95 / 5%);
  transition: all 0.2s;
  width: 100%;
  max-width: 250px;
  height: 390px;
  cursor: pointer;
  &:hover {
    box-shadow: 0 2px 10px rgb(0 0 0 / 30%);
    transition: all 0.2s;
  }
`
const ImageWrapper = styled.div`
  height: 150px;
  & img {
    display: block;
    width: 100%;
    height: auto;
    max-width: 150px;
    margin: 0 auto;
  }
  & .favorite-icon {
    position: absolute;
    top: 20px;
    right: 10px;
    cursor: pointer;
  }
`
const ContentWrapper = styled.div`
  & .product-status {
    color: var(--greenColorSecondary);
    font-size: 12px;
  }
  & .product-price {
    font-weight: bold;
  }
  & .product-name {
    overflow: hidden; /* скрываем текст, выходящий за пределы элемента */
    text-overflow: ellipsis; /* добавляем троеточие в конце текста */
    display: -webkit-box;
    -webkit-line-clamp: 3; /* количество строк, которые вы хотите показать */
    -webkit-box-orient: vertical;
    font-size: 14px;
    height: 54px;
    &:hover {
      color: var(--greenColorSecondary);
    }
  }
  & .product-basket {
    font-size: 14px;
    width: 100%;
    & p {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }
  }
  & .review-count {
    font-size: 12px;
    padding: 0;
    margin: 0;
    color: #2270ee;
  }

  & .review-empty {
    display: flex;
    align-items: center;
    gap: 10px;
    & p {
      font-size: 12px;
      margin: 0;
      color: #2270ee;
    }
  }
`

export { ContentWrapper, ImageWrapper, Wrapper }
