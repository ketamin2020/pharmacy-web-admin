import { Typography } from 'antd'

import styled from '@emotion/styled'

export const TitleBox: React.FC = () => {
  return (
    <Wrapper>
      <Box>
        <Typography.Title style={{ color: 'white' }}>
          Join Our <br /> Community
        </Typography.Title>
        <Typography.Text style={{ color: 'white' }}>Create Your Dream!</Typography.Text>
      </Box>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  @media screen and (max-width: 800px) {
    display: none;
  }
  background-image: linear-gradient(135deg, rgba(0, 255, 60, 0.3), rgba(0, 157, 255, 0.3));
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  border-radius: 0px 30px 30px 0;
  min-height: 550px;
  width: 100%;
`

const Box = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  min-width: 300px;
`
