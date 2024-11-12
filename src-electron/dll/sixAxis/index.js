import { Dll } from '../'

export const sixAxis = new Dll({
  name: 'sixAxisDll',
  path: 'src/main/dll/sixAxis/SixaxisDll.dll',
  config: {
    'Connect': ['bool', [
      'string', // remoteIp
      'int', // remotePort
      'float', // rotationLimit
      'float' // accelerationLimit
    ]],
    'SendMessageWash64Time': ['void', [
      'int', // timestamp
      'float', // rotationX
      'float', // rotationY
      'float', // rotationZ
      'float', // accelerationX
      'float', // accelerationY
      'float', // accelerationZ
      'int', // platformControl
      'float' // accScale
    ]],
  }
})