# Coffeekraken s-parallax-component <img src=".resources/coffeekraken-logo.jpg" height="25px" />

<p>
	<!-- <a href="https://travis-ci.org/coffeekraken/s-parallax-component">
		<img src="https://img.shields.io/travis/coffeekraken/s-parallax-component.svg?style=flat-square" />
	</a> -->
	<a href="https://www.npmjs.com/package/coffeekraken-s-parallax-component">
		<img src="https://img.shields.io/npm/v/coffeekraken-s-parallax-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-parallax-component/blob/master/LICENSE.txt">
		<img src="https://img.shields.io/npm/l/coffeekraken-s-parallax-component.svg?style=flat-square" />
	</a>
	<!-- <a href="https://github.com/coffeekraken/s-parallax-component">
		<img src="https://img.shields.io/npm/dt/coffeekraken-s-parallax-component.svg?style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-parallax-component">
		<img src="https://img.shields.io/github/forks/coffeekraken/s-parallax-component.svg?style=social&label=Fork&style=flat-square" />
	</a>
	<a href="https://github.com/coffeekraken/s-parallax-component">
		<img src="https://img.shields.io/github/stars/coffeekraken/s-parallax-component.svg?style=social&label=Star&style=flat-square" />
	</a> -->
	<a href="https://twitter.com/coffeekrakenio">
		<img src="https://img.shields.io/twitter/url/http/coffeekrakenio.svg?style=social&style=flat-square" />
	</a>
	<a href="http://coffeekraken.io">
		<img src="https://img.shields.io/twitter/url/http/shields.io.svg?style=flat-square&label=coffeekraken.io&colorB=f2bc2b&style=flat-square" />
	</a>
</p>

<p class="lead">Provide a nice and declarative way to create parallax effect depending on the scroll and/or the mouse</p>

[![View demo](http://components.coffeekraken.io/assets/img/view-demo.png)](http://components.coffeekraken.io/app/s-parallax-component)

## Table of content

1. **[Demo](http://components.coffeekraken.io/app/s-parallax-component)**
2. [Install](#readme-install)
3. [Get Started](#readme-get-started)
4. [Displacements](#readme-displacements)
5. [Layers](#readme-layers)
6. [Appliers](#readme-appliers)
4. [Javascript API](doc/js)
5. [Sugar Web Components Documentation](https://github.com/coffeekraken/sugar/blob/master/doc/webcomponent.md)
6. [Browsers support](#readme-browsers-support)
7. [Code linting](#readme-code-linting)
8. [Contribute](#readme-contribute)
9. [Who are Coffeekraken?](#readme-who-are-coffeekraken)
10. [Licence](#readme-license)

<a name="readme-install"></a>

## Install

```
npm install coffeekraken-s-parallax-component --save
```

<a name="readme-get-started"></a>

## Get Started

First, import the component into your javascript file like so:

```js
import SParallaxComponent from 'coffeekraken-s-parallax-component'
```

Then simply use it inside your html like so:

```html
<s-parallax scroll-y="300">
	<!-- your coontent here... -->
</s-parallax>
```

<a id="readme-displacements"></a>
## Displacements

This component works around a concept of displacement. The displacement is the amount of movement the component can have depending on the scroll and/or the mouse movement
A displacement is calculated based on the center of the screen and the scroll/mouse movement amount.
To specify a possible displacement amount, use the `scroll` and `mouse` component property. Here's how:

```html
<!-- this mean a possible displacement based on the mouse -->
<s-parallax mouse-x="200" mouse-y="400"></s-parallax>
<!-- this mean a possible displacement based on the scroll -->
<s-parallax scroll-y="200"></s-parallax>
```

<a id="readme-layers"></a>
## Layers

To simplify the use of displacements, etc... a layer system has been built-in. A layer is simply some properties attached to a layer name that you can apply simply in your html like so:

First, register a layer

```js
import SParallaxComponent from 'coffeekraken-s-parallax-component'
SParallaxComponent.registerLayer('my-cool-layer', {
	mouseX: 200,
	mouseY: 400
})
```

Then apply your layer to any `s-parallax` component in your html like so:

```html
<s-parallax layer="my-cool-layer">
	<!-- your html content here... -->
</s-parallax>
```

<a id="readme-appliers"></a>
## Appliers

By default, this component support two ways of applying the displacement:

1. `transform`: Apply the displacement as a transform css property
2. `background`: Apply the displacement as a background-position css property

This list can be extended by register new appliers like so:

```js
import SParallaxComponent from 'coffeekraken-s-parallax-component'
SParallaxComponent.registerApplier('rotate', (component, displacements) => {
	component.style.transform = `rotateX(${displacements.x}) rotateY(${displacements.y})`
})
```

You can then tell your `s-parallax` component to use this applier like so:

```html
<s-parallax applier="rotate" layer="my-cool-layer">
	<!-- your html here... -->
</s-parallax>
```

<a id="readme-browsers-support"></a>

## Browsers support

| <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/edge.png" alt="IE / Edge" width="16px" height="16px" /></br>IE / Edge | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/firefox.png" alt="Firefox" width="16px" height="16px" /></br>Firefox | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/chrome.png" alt="Chrome" width="16px" height="16px" /></br>Chrome | <img src="https://raw.githubusercontent.com/godban/browsers-support-badges/master/src/images/safari.png" alt="Safari" width="16px" height="16px" /></br>Safari |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| IE11+                                                                                                                                                              | last 2 versions                                                                                                                                                   | last 2 versions                                                                                                                                                | last 2 versions                                                                                                                                                |

> As browsers are automatically updated, we will keep as reference the last two versions of each but this component can work on older ones as well.

> The webcomponent API (custom elements, shadowDOM, etc...) is not supported in some older browsers like IE10, etc... In order to make them work, you will need to integrate the [corresponding polyfill](https://www.webcomponents.org/polyfills).

<a id="readme-code-linting"></a>

## Code linting

This package uses some code linting rules. Here's the list:

1. [ESLint](https://eslint.org/) with [airbnb](https://www.npmjs.com/package/eslint-config-airbnb) and [prettier](https://github.com/prettier/eslint-config-prettier) rules for javascript files
2. [Stylelint](https://github.com/stylelint/stylelint) with [stylelint-config-standard](https://github.com/stylelint/stylelint-config-standard) for `scss` files

> Your commits will not been accepted if the code style is not respected!

<a id="readme-contribute"></a>

## Contribute

This is an open source project and will ever be! You are more that welcomed to contribute to his development and make it more awesome every day.
To do so, you have several possibilities:

1. [Share the love ❤️](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-share-the-love)
2. [Declare issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-declare-issues)
3. [Fix issues](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-fix-issues)
4. [Add features](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-add-features)
5. [Build web component](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md#contribute-build-web-component)

<a id="readme-who-are-coffeekraken"></a>

## Who are Coffeekraken

We try to be **some cool guys** that build **some cool tools** to make our (and yours hopefully) **every day life better**.

#### [More on who we are](https://github.com/Coffeekraken/coffeekraken/blob/master/who-are-we.md)

<a id="readme-license"></a>

## License

The code is available under the [MIT license](LICENSE). This mean that you can use, modify, or do whatever you want with it. This mean also that it is shipped to you for free, so don't be a hater and if you find some issues, etc... feel free to [contribute](https://github.com/Coffeekraken/coffeekraken/blob/master/contribute.md) instead of sharing your frustrations on social networks like an asshole...
