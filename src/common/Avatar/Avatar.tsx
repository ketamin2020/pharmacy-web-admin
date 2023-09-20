import styled from '@emotion/styled'

type Props = {
  pictureURL?: string | null
  size?: number
  color?: string | null
  children?: string
  text?: string
  className?: string
  title?: string
}

type PropsStyle = {
  pictureURL?: string | null
  size: number
  backgroundColor?: string | null
}

export const Avatar = ({ children, color, size = 36, title, pictureURL, className }: Props) => (
  <Wrapper backgroundColor={color} size={size} pictureURL={pictureURL} className={className}>
    {!pictureURL
      ? children
          ?.split(/\s+/)
          ?.splice(0, 2)
          ?.map(world => world[0]?.toUpperCase())
          ?.join('')
      : null}
  </Wrapper>
)

export const Wrapper = styled.div<PropsStyle>`
  background-image: ${props => `url(${props.pictureURL})`};
  background-color: ${props => props.backgroundColor};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  border: 2px solid #fff;

  border-radius: 50%;
  color: white;
  font-size: ${props => props.size * 0.45}px;

  height: ${props => props.size}px;
  width: ${props => props.size}px;

  display: flex;
  align-items: center;
  justify-content: center;
`
