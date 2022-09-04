import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'

import {
  Box,
  SkeletonText,
  ButtonGroup,
  Flex,
  HStack,
  Input,
  Text,
  Select,
  IconButton
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import { useRef, useState } from 'react'

const center = { lat: 1.3637, lng:103.9882 }                                // Singapore CAAS Location Latitude and Longitude

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,              ///API key us can create in google cloud service console
    libraries: ['places']
  })

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')


  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destinationRef = useRef()


/** @type React.MutableRefObject<HTMLInputElement> */
  const travelBy = useRef()

/** @type React.MutableRefObject<HTMLInputElement> */
  const wayPoints = useRef()


 const waypts = []
  if (!isLoaded) {
    return <SkeletonText />
  }

  async function findRoute() {
    if (originRef.current.value === '' || destinationRef.current.value === '' || travelBy.current.value==='' ) {
      return
    }
      if(wayPoints.current.value){

      waypts.push({
        location: wayPoints.current.value,
        stopover: true,
      });

      }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: originRef.current.value,
      destination: destinationRef.current.value,
      // eslint-disable-next-line no-undef
      travelMode: travelBy.current.value,
      provideRouteAlternatives:true,
      optimizeWaypoints:false,
      waypoints:waypts

    })
    if (results.status === 'OK') {
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    }
  }

  function resetRoute() {
      originRef.current.value = ''
      destinationRef.current.value = ''
      wayPoints.current.value = ''
      travelBy.current.value = ''
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')

  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
          center={center}
          zoom={12}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={5}
        borderRadius='lg'
        m={5}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
        alignSelf="right"
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
             Origin:: <Autocomplete>
            <Input type='text' placeholder='Origin' ref={originRef} onBlur={findRoute}/>
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
          Destination::   <Autocomplete>
             <Input
                type='text'
                placeholder='Destination'
                ref={destinationRef} onBlur={findRoute}
              />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
           Way Point(Via):: <Autocomplete>
              <Input
                type='text'
                placeholder='Way Points (Via Route)'
                ref={wayPoints} onBlur={findRoute}
              />
            </Autocomplete>
          </Box>
        <Box>
        <Select placeholder='Mode of Travel' ref={travelBy} size='md' width='auto' variant='filled' onChange={findRoute}>
           <option value='DRIVING'>Driving</option>
           <option value='BICYCLING'>Bi Cycle</option>
           <option value='TRANSIT'>Public Transport</option>
           <option value='WALKING'>Walk for Life</option>
        </Select>
        </Box>
          <ButtonGroup>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={resetRoute}
            />
          </ButtonGroup>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
         </Box>
    </Flex>
  )
}

export default App
