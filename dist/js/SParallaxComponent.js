"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SWebComponent2 = _interopRequireDefault(require("coffeekraken-sugar/js/core/SWebComponent"));

var _addEventListener = _interopRequireDefault(require("coffeekraken-sugar/js/dom/addEventListener"));

var _scrollLeft = _interopRequireDefault(require("coffeekraken-sugar/js/dom/scrollLeft"));

var _scrollTop = _interopRequireDefault(require("coffeekraken-sugar/js/dom/scrollTop"));

var _offset = _interopRequireDefault(require("coffeekraken-sugar/js/dom/offset"));

var _constrain = _interopRequireDefault(require("coffeekraken-sugar/js/utils/numbers/constrain"));

var _inViewportStatusChange = _interopRequireDefault(require("coffeekraken-sugar/js/dom/inViewportStatusChange"));

var _dispatchEvent = _interopRequireDefault(require("coffeekraken-sugar/js/dom/dispatchEvent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

// save the registered appliers
var __appliers = {};
var __layers = {};
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

var SParallaxComponent =
/*#__PURE__*/
function (_SWebComponent) {
  _inherits(SParallaxComponent, _SWebComponent);

  function SParallaxComponent() {
    _classCallCheck(this, SParallaxComponent);

    return _possibleConstructorReturn(this, _getPrototypeOf(SParallaxComponent).apply(this, arguments));
  }

  _createClass(SParallaxComponent, [{
    key: "componentMount",

    /**
     * Mount component
     * @definition    SWebComponent.componentMount
     * @protected
     */
    value: function componentMount() {
      var _this = this;

      _get(_getPrototypeOf(SParallaxComponent.prototype), "componentMount", this).call(this); // check layer


      if (this.props.layer) {
        this.setProps(__layers[this.props.layer]);
      } // init vars


      this._scrollPercents = {
        x: 0,
        y: 0
      };
      this._mousePercents = {
        x: 0,
        y: 0 // add the listeners

      };

      this._addListeners(); // detect when the parallax element enter and exit the viewport


      this._inViewportStatusChangeDetector = (0, _inViewportStatusChange.default)(this, function () {
        _this._isInViewport = true;

        _this._mutateDom();
      }, function () {
        _this._isInViewport = false;
      });

      this._onScrollHandler();

      this._mutateDom();
    }
    /**
     * Component unmount
     * @definition    SWebComponent.componentUnmount
     * @protected
     */

  }, {
    key: "componentUnmount",
    value: function componentUnmount() {
      _get(_getPrototypeOf(SParallaxComponent.prototype), "componentUnmount", this).call(this); // remove listeners


      this._removeListeners(); // destroy the in viewport status change detector


      if (this._inViewportStatusChangeDetector) this._inViewportStatusChangeDetector.destroy();
    }
    /**
     * Scroll event handler
     */

  }, {
    key: "_onScrollHandler",
    value: function _onScrollHandler() {
      // check if we need to handle the scroll
      if (!this.props.scrollX && !this.props.scrollY) return; // check that the plugin is enabled

      if (!this.isEnabled()) return; // get the scroll positions

      var scrollL = (0, _scrollLeft.default)();
      var scrollT = (0, _scrollTop.default)(); // get the element offset

      var offsetThis = (0, _offset.default)(this); // store the offset from the center of the element

      var offsetRelToCenter = {
        top: (0, _constrain.default)(offsetThis.top - scrollT + this.offsetHeight * .5, -this.offsetHeight * .5, window.innerHeight + this.offsetHeight * .5),
        left: (0, _constrain.default)(offsetThis.left - scrollL + this.offsetWidth * .5, -this.offsetWidth * .5, window.innerWidth + this.offsetWidth * .5) // calculate the distance from the middle of the screen

      };
      var distX = offsetRelToCenter.left - window.innerWidth * .5;
      var distY = offsetRelToCenter.top - window.innerHeight * .5; // calculate the percent x and y

      var percentX = 100 / (window.innerWidth * .5) * distX;
      var percentY = 100 / (window.innerHeight * .5) * distY; // save the percents into a global variable

      this._scrollPercents = {
        x: percentX,
        y: percentY
      };
    }
    /**
     * Mousemove event handler
     * @param    {MouseEvent}    e    The mouse event
     */

  }, {
    key: "_onMouseMoveHandler",
    value: function _onMouseMoveHandler(e) {
      // check if we need to handle the mouse
      if (!this.props.mouseX && !this.props.mouseY) return; // check that the plugin is enabled

      if (!this.isEnabled()) return; // calculate the distance x and y from the mouse to the center of the screen

      var distX = e.clientX - window.innerWidth * .5;
      var distY = e.clientY - window.innerHeight * .5;
      var percentX = 100 / (window.innerWidth * .5) * distX;
      var percentY = 100 / (window.innerHeight * .5) * distY; // save the mouse percent move

      this._mousePercents = {
        x: percentX,
        y: percentY
      };
    }
    /**
     * Mutate the dom
     */

  }, {
    key: "_mutateDom",
    value: function _mutateDom() {
      // compute the strengths
      var mouseXStrength = 0,
          mouseYStrength = 0;
      if (typeof this.props.mouseX === 'number') mouseXStrength = this.props.mouseX;
      if (typeof this.props.mouseY === 'number') mouseYStrength = this.props.mouseY;
      var scrollXStrength = 0,
          scrollYStrength = 0;
      if (typeof this.props.scrollX === 'number') scrollXStrength = this.props.scrollX;
      if (typeof this.props.scrollY === 'number') scrollYStrength = this.props.scrollY; // calculate the displacement of the component itself

      var mouseDisplacementX = mouseXStrength / 100 * this._mousePercents.x;
      var mouseDisplacementY = mouseYStrength / 100 * this._mousePercents.y;
      var scrollDisplayementX = scrollXStrength / 100 * this._scrollPercents.x;
      var scrollDisplayementY = scrollYStrength / 100 * this._scrollPercents.y; // calculate the actual displacement to apply

      var displacementX = (mouseDisplacementX + scrollDisplayementX) * .5;
      var displacementY = (mouseDisplacementY + scrollDisplayementY) * .5; // apply min max

      var minX = typeof this.props.minX === 'number' ? this.props.minX : -99999999;
      var minY = typeof this.props.minY === 'number' ? this.props.minY : -99999999;
      var maxX = typeof this.props.maxX === 'number' ? this.props.maxX : 99999999;
      var maxY = typeof this.props.maxY === 'number' ? this.props.maxY : 99999999;
      displacementX = (0, _constrain.default)(displacementX, minX, maxX);
      displacementY = (0, _constrain.default)(displacementY, minY, maxY); // get the applier function

      var applierFn = typeof this.props.applier === 'function' ? this.props.applier : __appliers[this.props.applier]; // apply the displacement using the applier function

      applierFn(this, {
        x: displacementX,
        y: displacementY
      }); // continue rendering if in viewport

      if (this._isInViewport && this.isEnabled()) {
        window.requestAnimationFrame(this._mutateDom.bind(this));
      }
    }
    /**
     * Add listeners
     */

  }, {
    key: "_addListeners",
    value: function _addListeners() {
      // scroll listener
      this._removeScrollEventHandler = (0, _addEventListener.default)(document, 'scroll', this._onScrollHandler.bind(this)); // mousemove listener

      this._removeMouseMoveEventHandler = (0, _addEventListener.default)(document, 'mousemove', this._onMouseMoveHandler.bind(this));
    }
    /**
     * Remove the listeners
     */

  }, {
    key: "_removeListeners",
    value: function _removeListeners() {
      if (this._removeScrollEventHandler) this._removeScrollEventHandler();
      if (this._removeMouseMoveEventHandler) this._removeMouseMoveEventHandler();
    }
    /**
     * Return if the plugin is enabled or not
     * @return    {Boolean}    true if enabled, false if not
     */

  }, {
    key: "isEnabled",
    value: function isEnabled() {
      if (typeof this.props.enabled === 'function') return this.props.enabled();
      return this.props.enabled;
    }
  }], [{
    key: "registerApplier",

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
    value: function registerApplier(name, fn) {
      __appliers[name] = fn;
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

  }, {
    key: "registerLayer",
    value: function registerLayer(name, props) {
      // register the layer 
      __layers[name] = props;
    }
    /**
     * Default props
     * @definition    SWebComponent.defaultProps
     * @protected
     */

  }, {
    key: "defaultCss",

    /**
     * Css
     * @protected
     */
    value: function defaultCss(componentName, componentNameDash) {
      return "\n      ".concat(componentNameDash, " {\n        display : inline-block;\n      }\n    ");
    }
  }, {
    key: "defaultProps",
    get: function get() {
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
      };
    }
    /**
     * Physical props
     * @definition    SWebComponent.physicalProps
     * @protected
     */

  }, {
    key: "physicalProps",
    get: function get() {
      return ['layer'];
    }
  }]);

  return SParallaxComponent;
}(_SWebComponent2.default); // register transform applier


exports.default = SParallaxComponent;
SParallaxComponent.registerApplier('transform', function (component, displacements) {
  component.style.transform = "translateX(".concat(displacements.x, "px) translateY(").concat(displacements.y, "px)");
}); // register invert transform applier

SParallaxComponent.registerApplier('!transform', function (component, displacements) {
  component.style.transform = "translateX(".concat(displacements.x * -1, "px) translateY(").concat(displacements.y * -1, "px)");
}); // register background applier

SParallaxComponent.registerApplier('background', function (component, displacements) {
  component.style.backgroundPosition = "calc(50% + ".concat(displacements.x, "px) calc(50% + ").concat(displacements.y, "px)");
}); // register the invert background applier

SParallaxComponent.registerApplier('!background', function (component, displacements) {
  component.style.backgroundPosition = "calc(50% - ".concat(displacements.x, "px) calc(50% - ").concat(displacements.y, "px)");
});