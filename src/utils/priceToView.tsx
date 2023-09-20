const l10nUSD = new Intl.NumberFormat('uk', { style: 'currency', currency: 'UAH' })
const priceToView = (price: string | number | bigint, isAfterDotShow?: boolean) => {
  let newPrice = '' + price
  newPrice = newPrice.replace(/[^-\d.]/g, '')
  if (newPrice !== '' && newPrice !== '-') newPrice = l10nUSD.format(newPrice)
  return /\.00$/.test(newPrice) && !isAfterDotShow ? newPrice.replace(/\.00$/, '') : newPrice
}

export { priceToView }
