import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngTuple } from 'leaflet'
import { MapContainerProps } from 'react-leaflet'
import { LocationOn } from '@material-ui/icons'
import ReactDOMServer from 'react-dom/server'
import L from 'leaflet'
import styled from '@emotion/styled'
import 'leaflet/dist/leaflet.css'
import { useSelector } from 'react-redux'
import { mainInfoSelector } from 'redux/main/mainSelectors'
const MapWrapper = styled.div`
  & .leaflet-div-icon {
    border: none;
    background-color: transparent;
  }
`

const position: LatLngTuple = [50.41365970726126, 30.543992123578576]
const Map: React.FC<MapContainerProps> = props => {
  const main = useSelector(mainInfoSelector)
  return (
    <MapWrapper>
      <MapContainer {...props} center={position} zoom={13} scrollWheelZoom={false}>
        <TileLayer
          url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=4c3b17fc-bee1-42cc-9b17-b4b51480d8c5'
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
        />

        <Marker
          icon={L.divIcon({
            iconSize: null,
            html: ReactDOMServer.renderToString(<LocationOn style={{ color: 'red' }} />),
          })}
          position={position}
        >
          <Popup>{main.address}</Popup>
        </Marker>
      </MapContainer>
    </MapWrapper>
  )
}

export default Map
