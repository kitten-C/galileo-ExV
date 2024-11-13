import koffi from 'koffi'
import path from 'path'

export default class Dll {
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