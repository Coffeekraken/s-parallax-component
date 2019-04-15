import SWebComponent from "coffeekraken-sugar/js/core/SWebComponent"
import addEventListener from 'coffeekraken-sugar/js/dom/addEventListener'
import scrollLeft from 'coffeekraken-sugar/js/dom/scrollLeft'
import scrollTop from 'coffeekraken-sugar/js/dom/scrollTop'
import offset from 'coffeekraken-sugar/js/dom/offset'
import constrain from 'coffeekraken-sugar/js/utils/numbers/constrain'
import inViewportStatusChange from 'coffeekraken-sugar/js/dom/inViewportStatusChange' 
import dispatchEvent from 'coffeekraken-sugar/js/dom/dispatchEvent'

// save the registered appliers
const __appliers = {}
const __layers = {}

/**
 * Provide a nice and declarative way to create parallax effect depending on the scroll and/or the mouse
 * 
 * @example    html
 * <!-- format is x:y -->
 * <s-parallax scroll="0:300">
 *   <!-- your coontent here... -->
 * </s-parallax>
 * 
 * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
 */
export default class SParallaxComponent extends SWebComponent {
  
  /**
   * Register a applier function
   * @param    {String}    name    The name of the applied function
   * @param    {Function}    fn     The actual applied function that will have as parameter the component itself and the displacementObject that contains the displacements to apply
   * @example    js
   * SParallaxComponent.registerApplier('transform', (component, displacements) => {
   *  component.style.transform = `translateX(${displacementX}px) translateY(${displacementY}px)`
   * })
   * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  static registerApplier(name, fn) {
    __appliers[name] = fn
  }

  /**
   * Register a layer.
   * A layer is made of a name and some settings to apply to make the use of this component more convenient
   * @param    {String}    name    The name of the layer
   * @param    {Object}    props    The properties to apply to this layer
   * @example    js
   * SParallaxComponent.registerLayer('background', {
   *   mouseX: 50,
   *   mouseY: 50
   * })
   * @author    Olivier Bossel <olivier.bossel@gmail.com> (https://olivierbossel.com)
   */
  static registerLayer(name, props) {
    // register the layer 
    __layers[name] = props
  }
  
  /**
   * Default props
   * @definition    SWebComponent.defaultProps
   * @protected
   */
  static get defaultProps() {
    return {

      /**
       * Specify if the mouse has an effect on the element x position
       * @prop
       * @type    {Boolean}
       */
      mouseX: false,

      /**
       * Specify if the mouse has an effect on the element y position
       * @prop
       * @type    {Boolean}
       */
      mouseY: false,

      /**
       * Specify if the scroll has an effect on the element x position
       * @prop
       * @type    {Boolean}
       */
      scrollX: false,

      /**
       * Specify if the scroll has an effect on the element y position
       * @prop
       * @type    {Boolean}
       */
      scrollY: false,

      /**
       * Specify a min value for x displacement
       * @prop
       * @type    {String}
       */
      minX: false,

      /**
       * Specify a min value for y displacement
       * @prop
       * @type    {String}
       */
      minY: false,

      /**
       * Specify a max value for x displacement
       * @prop
       * @type    {String}
       */
      maxX: false,

      /**
       * Specify a max value for y displacement
       * @prop
       * @type    {String}
       */
      maxY: false,

      /**
       * Specify the applier to use to apply the displacements to the component
       * Available ones:
       * - `transform` (default)
       * - `!transform` : invert transform
       * - `background`
       * - `!background` : invert background
       * @prop
       * @type    {String|Function}
       */
      applier: 'transform',

      /**
       * Specify if the effect has to be enabled or not. Can be a boolean of a function that return a boolean
       * @prop
       * @type    {Boolean|Function}
       */
      enabled: true,

      /**
       * Specify a layer to use a properties
       * @prop
       * @type    {String}
       */
      layer: null

    }
  }

  /**
   * Physical props
   * @definition    SWebComponent.physicalProps
   * @protected
   */
  static get physicalProps() {
    return ['layer']
  }

  /**
   * Css
   * @protected
   */
  static defaultCss(componentName, componentNameDash) {
    return `
      ${componentNameDash} {
        display : block;
      }
    `
  }

  /**
   * Mount component
   * @definition    SWebComponent.componentMount
   * @protected
   */
  componentMount() {
    super.componentMount()

    // check layer
    if (this.props.layer) {
      this.setProps(__layers[this.props.layer])
    }

    // init vars
    this._scrollPercents = {
      x: 0,
      y: 0
    }
    this._mousePercents = {
      x: 0,
      y: 0
    }

    // add the listeners
    this._addListeners()

    // detect when the parallax element enter and exit the viewport
    this._inViewportStatusChangeDetector = inViewportStatusChange(this, () => {
      this._isInViewport = true
      this._mutateDom()
    }, () => {
      this._isInViewport = false
    })

    this._onScrollHandler()
    this._mutateDom()
    
  }

  /**
   * Component unmount
   * @definition    SWebComponent.componentUnmount
   * @protected
   */
  componentUnmount() {
    super.componentUnmount()

    // remove listeners
    this._removeListeners()
    
    // destroy the in viewport status change detector
    if (this._inViewportStatusChangeDetector) this._inViewportStatusChangeDetector.destroy()
  }

  /**
   * Scroll event handler
   */
  _onScrollHandler() {
    // check if we need to handle the scroll
    if (!this.props.scrollX && !this.props.scrollY) return
    // check that the plugin is enabled
    if (!this.isEnabled()) return

    // get the scroll positions
    const scrollL = scrollLeft()
    const scrollT = scrollTop()

    // get the element offset
    const offsetThis = offset(this)

    // store the offset from the center of the element
    const offsetRelToCenter = {
      top: constrain(offsetThis.top - scrollT + this.offsetHeight * .5, -this.offsetHeight*.5, window.innerHeight+this.offsetHeight*.5),
      left: constrain(offsetThis.left - scrollL + this.offsetWidth * .5, -this.offsetWidth*.5, window.innerWidth+this.offsetWidth*.5)
    }

    // calculate the distance from the middle of the screen
    const distX = offsetRelToCenter.left - window.innerWidth * .5
    const distY = offsetRelToCenter.top - window.innerHeight * .5

    // calculate the percent x and y
    const percentX = 100 / (window.innerWidth * .5) * distX
    const percentY = 100 / (window.innerHeight * .5) * distY

    // save the percents into a global variable
    this._scrollPercents = {
      x: percentX,
      y: percentY
    }
  }

  /**
   * Mousemove event handler
   * @param    {MouseEvent}    e    The mouse event
   */
  _onMouseMoveHandler(e) {
    // check if we need to handle the mouse
    if (!this.props.mouseX && !this.props.mouseY) return
    // check that the plugin is enabled
    if (!this.isEnabled()) return

    // calculate the distance x and y from the mouse to the center of the screen
    const distX = e.clientX - window.innerWidth * .5
    const distY = e.clientY - window.innerHeight * .5
    const percentX = 100 / (window.innerWidth * .5) * distX
    const percentY = 100 / (window.innerHeight * .5) * distY
    // save the mouse percent move
    this._mousePercents = {
      x: percentX,
      y: percentY
    }
  }

  /**
   * Mutate the dom
   */
  _mutateDom() {

    // compute the strengths
    let [mouseXStrength, mouseYStrength] = [0,0]
    if (typeof this.props.mouseX === 'number') mouseXStrength = this.props.mouseX
    if (typeof this.props.mouseY === 'number') mouseYStrength = this.props.mouseY
    
    let [scrollXStrength, scrollYStrength] = [0,0]
    if (typeof this.props.scrollX === 'number') scrollXStrength = this.props.scrollX
    if (typeof this.props.scrollY === 'number') scrollYStrength = this.props.scrollY

    // calculate the displacement of the component itself
    const mouseDisplacementX = mouseXStrength / 100 * this._mousePercents.x
    const mouseDisplacementY = mouseYStrength / 100 * this._mousePercents.y
    const scrollDisplayementX = scrollXStrength / 100 * this._scrollPercents.x
    const scrollDisplayementY = scrollYStrength / 100 * this._scrollPercents.y

    // calculate the actual displacement to apply
    let displacementX = (mouseDisplacementX + scrollDisplayementX) * .5
    let displacementY = (mouseDisplacementY + scrollDisplayementY) * .5

    // apply min max
    const minX = (typeof this.props.minX === 'number') ? this.props.minX : -99999999
    const minY = (typeof this.props.minY === 'number') ? this.props.minY : -99999999
    const maxX = (typeof this.props.maxX === 'number') ? this.props.maxX : 99999999
    const maxY = (typeof this.props.maxY === 'number') ? this.props.maxY : 99999999
    displacementX = constrain(displacementX, minX, maxX)
    displacementY = constrain(displacementY, minY, maxY)

    // get the applier function
    const applierFn = (typeof this.props.applier === 'function') ? this.props.applier : __appliers[this.props.applier]

    // apply the displacement using the applier function
    applierFn(this, {
      x: displacementX,
      y: displacementY
    })

    // continue rendering if in viewport
    if (this._isInViewport && this.isEnabled()) {
      window.requestAnimationFrame(this._mutateDom.bind(this))
    }
  }

  /**
   * Add listeners
   */
  _addListeners() {
    // scroll listener
    this._removeScrollEventHandler = addEventListener(document, 'scroll', this._onScrollHandler.bind(this))
    // mousemove listener
    this._removeMouseMoveEventHandler = addEventListener(document, 'mousemove', this._onMouseMoveHandler.bind(this))
  }

  /**
   * Remove the listeners
   */
  _removeListeners() {
    if (this._removeScrollEventHandler) this._removeScrollEventHandler()
    if (this._removeMouseMoveEventHandler) this._removeMouseMoveEventHandler()
  }

  /**
   * Return if the plugin is enabled or not
   * @return    {Boolean}    true if enabled, false if not
   */
  isEnabled() {
    if (typeof this.props.enabled === 'function') return this.props.enabled()
    return this.props.enabled
  }

}

// register transform applier
SParallaxComponent.registerApplier('transform', (component, displacements) => {
  component.style.transform = `translateX(${displacements.x}px) translateY(${displacements.y}px)`
})

// register invert transform applier
SParallaxComponent.registerApplier('!transform', (component, displacements) => {
  component.style.transform = `translateX(${displacements.x * -1}px) translateY(${displacements.y * -1}px)`
})

// register background applier
SParallaxComponent.registerApplier('background', (component, displacements) => {
  component.style.backgroundPosition = `calc(50% + ${displacements.x}px) calc(50% + ${displacements.y}px)`
})

// register the invert background applier
SParallaxComponent.registerApplier('!background', (component, displacements) => {
  component.style.backgroundPosition = `calc(50% - ${displacements.x}px) calc(50% - ${displacements.y}px)`
})