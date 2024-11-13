const koffi = require('koffi')
const path = require('path')

class Dll {
  constructor(parameters) {
    this.lib = koffi.load(path.resolve(path.dirname(__dirname), parameters.path))
    this.init(parameters.config)
  }

  init(config) {
    Object.keys(config).forEach(k => {
      const v = config[k]
      const ret = v[0]
      const params = v[1]
      this.lib.func(k, ret, params)
    })
  }
}

module.exports = Dll