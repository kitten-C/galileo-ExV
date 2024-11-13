const Dll = require('../dll')
const path = require('path')

const dllPath = path.resolve(path.dirname(__dirname), 'src/dll/treadmill/ComApi.dll')
const config = {
  'InitSerialPort': ['bool', ['int', 'int', 'string', 'int', 'int', 'int']],
  'Stop': ['bool', []],
  'StartTreadmill': ['int', ['int']],
  'StopTreadmill': ['int', []],
  'AddVel': ['void', ['int']],
  'delVel': ['void', ['int']],
  'WarnStop': ['int', []]
}

const treadmillDll = new Dll({ path: dllPath, config })

module.exports = treadmillDll