import React from 'react'
import { DrugsTable } from './components/DrugsTable'
import styled from '@emotion/styled'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { Instruction } from './components/Instruction'
import { Property } from './components/Property'
import { Images } from './components/Images'
import { Groups } from './components/Groups'
import { Substance } from './components/Substance'
import { Makers } from './components/Makers'
const Wrapper = styled.section``
interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}
function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}
export const Drugs = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Wrapper>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
            <Tab label='Drugs List' {...a11yProps(0)} />
            <Tab label='Instructions' {...a11yProps(1)} />
            <Tab label='Properties' {...a11yProps(2)} />
            <Tab label='Images' {...a11yProps(3)} />
            <Tab label='Groups' {...a11yProps(4)} />
            <Tab label='Active Substanses' {...a11yProps(5)} />
            <Tab label='Makers' {...a11yProps(6)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <DrugsTable />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Instruction />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Property />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Images />
        </TabPanel>
        <TabPanel value={value} index={4}>
          <Groups />
        </TabPanel>
        <TabPanel value={value} index={5}>
          <Substance />
        </TabPanel>
        <TabPanel value={value} index={6}>
          <Makers />
        </TabPanel>
      </Box>
    </Wrapper>
  )
}
