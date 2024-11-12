import koffi from 'koffi';
import { v4 as uuidV4 } from 'uuid';
import nodePath from 'path';
import globalConfig from '@shared/mergedConfig'

const dirPath = nodePath.dirname(__dirname)

/**
 * @class Dll
 * @description 调用dll
 * @param {Object} options
 * @param {String} options.name - dll名称
 * @param {String} options.ffi - ffi类型，可选 koffi
 * @param {String} options.path - dll路径
 * @param {Object} options.config - 配置
 */
export class Dll {
  constructor({ name, path, config }) {
    if (!name) {
      throw new Error('name is required');
    }
    if (!path) {
      throw new Error('path is required');
    }
    this.name = name;
    this.ffi = globalConfig.ffi || 'koffi';

    this.path = nodePath.join(dirPath, path);
    this.config = config;
    this.koffiCallBackTypes = {}
    this.koffiCallBacks = []
    this.initFFI()
  }

  initFFI() {
    if (this.ffi === 'koffi') {
      this.koffi = koffi.load(this.path);
      const funcs = {}
      Object.keys(this.config).forEach(key => {
        const self = this
        const resultType = this.config[key][0];
        const argsType = this.config[key][1];
        let hasCallback = false
        const _argsType = argsType.map(item => {
          if (typeof item === 'string') {
            return item
          } else if (item.type === 'pointer') {
            this.prepareKoffiRegisterCallbackTypes(key, item.name, koffi.proto(item.name, item.resultType, item.argType))
            hasCallback = true
            return `${item.name} *cb_${uuidV4().replace(/-/g, '')}`
          }
        })
        if (hasCallback) {
          // 如果有回调的情况下需要帮忙代理
          const fn = this.koffi.func(`${resultType} ${key}(${_argsType.join(', ')})`)
          funcs[key] = function () {
            const args = [...arguments].map(item => {
              if (typeof item === 'function') {
                const name = item.$kid
                const cb = self.registerKoffiCallback(key, name, item)
                self.koffiCallBacks.push(cb)
                return cb
              } else {
                return item
              }
            });
            const result = fn(...args)
            return result
          }
        } else {
          // 否则直接使用
          funcs[key] = this.koffi.func('__stdcall', key, resultType, _argsType)
        }
      })
      this.lib = funcs;
    } else {
      const _config = {}
      this.config && Object.keys(this.config).forEach(key => {
        const resultType = this.config[key][0];
        const argsType = this.config[key][1];
        const _argsType = argsType.map(item => {
          if (typeof item === 'string') {
            return item
          } else if (item.type === 'pointer') {
            return 'pointer'
          }
        })
        _config[key] = [resultType, _argsType]
      })
      this.lib = ffi.Library(this.path, _config);
    }
  }

  prepareKoffiRegisterCallbackTypes(fnName, callbackName, proto) {
    console.log('prepareKoffiRegisterCallbackTypes', fnName, callbackName)
    // 判断是否存在 fnName
    this.koffiCallBackTypes[fnName] = this.koffiCallBackTypes[fnName] || {}
    // 直接塞
    this.koffiCallBackTypes[fnName][callbackName] = proto
  }

  registerKoffiCallback(fnName, callbackName, callback) {
    if (!fnName) {
      throw new Error('callback function must have a name，dll 的回调函数必须命名')
    }
    if (this.koffiCallBackTypes[fnName] && this.koffiCallBackTypes[fnName][callbackName]) {
      const proto = this.koffiCallBackTypes[fnName][callbackName]
      return koffi.register(callback, koffi.pointer(proto))
    } else {
      // 没有在初始化的时候声明
      throw new Error('callback function is not declared when initializing，初始化时未声明回调函数')
    }
  }

  registerCallback(resultType, argsType, callback) {
    if (this.ffi === 'koffi') {
      // 不需要注册
      return callback
    } else {
      console.log('ffi-napi', resultType, argsType, callback)
      return ffi.Callback(resultType, argsType, callback);
    }
  }

  unregisterKoffiCallback(callback) {
    if (this.koffiCallBacks.includes(callback)) {
      koffi.unregister(callback)
    } else {
      // 不是自己管理的 callback
      throw new Error(`callback is not registered by this koffi ${this.$kid}`)
    }
  }

  unregisterAllKoffiCallback() {
    if (this.ffi === 'koffi' && this.koffiCallBacks.length > 0) {
      this.koffiCallBacks.forEach(cb => {
        koffi.unregister(cb)
      })
    }
  }
}