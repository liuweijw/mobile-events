/**
 * 自定义事件处理句柄生成器
 * 每个自定义事件处理句柄以自定义事件命名
 * 所有处理句柄可传入三个参数：
 * ①bindTarget：事件绑定对象
 * ②callback：事件处理回调(必须向callback传入原生事件对象e)
 * ③delegateTarget：事件代理对象
 */
class Events {
  /**
   * _delegateEvent 事件代理处理
   * @param  {String(Selector) | HTMLDivElement} bindTarget     事件绑定元素
   * @param  {String(Selector)} delegateTarget 事件代理元素
   * @param  {Object} target         原生事件对象上的target对象，即(e.target)
   * @return {Object | null}             如果存在代理，则调用此方法，事件发生在代理对象上则返回代理对象
   */
  _delegateEvent (bindTarget, delegateTarget, target) {
    if (!delegateTarget) return null
    const delegateTargets = new Set(document.querySelectorAll(delegateTarget))
    while (target !== bindTarget) {
      if (delegateTargets.has(target)) {
        return target
      } else {
        target = target.parentNode
      }
    }
    return null
  }
  /**
   * longtap 自定义长按事件
   */
  longtap (bindTarget, callback, delegateTarget) {
    let longTapCallback = callback
    let shortTapCallback = null
    let timer = null
    if (typeof callback === 'object') {
      longTapCallback = callback[0]
      shortTapCallback = callback[1]
    }
    bindTarget.addEventListener(
      'touchstart',
      e => {
        const target = this._delegateEvent(
          bindTarget,
          delegateTarget,
          e.target
        )
        if ((delegateTarget && target) || !delegateTarget) {
          timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
          }, 500)
        } else {
        }
      },
      false
    )
    bindTarget.addEventListener(
      'touchend',
      e => {
        const target = this._delegateEvent(
          bindTarget,
          delegateTarget,
          e.target
        )
        if ((delegateTarget && target) || !delegateTarget) {
          if (timer) {
            longTapCallback(e)
          } else {
            shortTapCallback && shortTapCallback(e)
          }
          clearTimeout(timer)
          timer = null
        } else {
        }
      },
      false
    )
  }
  /**
   * dbtap 自定义双击事件
   */
  dbtap (bindTarget, callback, delegateTarget) {
    const xrange = 100
    const yrange = 100
    let timer = null
    let lastClientX
    let lastClientY
    bindTarget.addEventListener('touchend', e => {
      const target = this._delegateEvent(bindTarget, delegateTarget, e.target)
      if ((delegateTarget && target) || !delegateTarget) {
        if (timer) {
          clearTimeout(timer)
          timer = null
          const thisClientX = e.changedTouches[0].clientX
          const thisClientY = e.changedTouches[0].clientY
          const x = Math.abs(thisClientX - lastClientX)
          const y = Math.abs(thisClientY - lastClientY)
          if (x <= xrange && y <= yrange) {
            callback(e)
          } else {
            lastClientX = e.changedTouches[0].clientX
            lastClientY = e.changedTouches[0].clientY
            timer = setTimeout(() => {
              lastClientX = null
              lastClientY = null
              clearTimeout(timer)
              timer = null
            }, 500)
          }
        }
      }
    })
  }
  dragup () {}
  dragdown () {}
  dragleft () {}
  dragright () {}
  swiftup () {}
  swiftdown () {}
  swiftleft () {}
  swiftright () {}
}

module.exports = new Events()