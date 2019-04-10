# SParallaxComponent

Provide a nice and declarative way to create parallax effect depending on the scroll and/or the mouse


### Example
```html
	<!-- format is x:y -->
<s-parallax scroll="0:300">
  <!-- your coontent here... -->
</s-parallax>
```
Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

Extends **SWebComponent**




## Attributes

Here's the list of available attribute(s).

### mouseX

Specify if the mouse has an effect on the element x position

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### mouseY

Specify if the mouse has an effect on the element y position

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### scrollX

Specify if the scroll has an effect on the element x position

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### scrollY

Specify if the scroll has an effect on the element y position

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }**

Default : **false**


### minX

Specify a min value for x displacement

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **false**


### minY

Specify a min value for y displacement

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **false**


### maxX

Specify a max value for x displacement

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **false**


### maxY

Specify a max value for y displacement

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **false**


### applier

Specify the applier to use to apply the displacements to the component
Available ones:
- `transform` (default)
- `!transform` : invert transform
- `background`
- `!background` : invert background

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) , [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **transform**


### enabled

Specify if the effect has to be enabled or not. Can be a boolean of a function that return a boolean

Type : **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) , [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**

Default : **true**


### layer

Specify a layer to use a properties

Type : **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**

Default : **null**




## Methods


### registerApplier

Register a applier function


#### Parameters
Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
name  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The name of the applied function  |  required  |
fn  |  **{ [Function](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Function) }**  |  The actual applied function that will have as parameter the component itself and the displacementObject that contains the displacements to apply  |  required  |

#### Example
```js
	SParallaxComponent.registerApplier('transform', (component, displacements) => {
 component.style.transform = `translateX(${displacementX}px) translateY(${displacementY}px)`
})
```
Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

**Static**


### registerLayer

Register a layer.
A layer is made of a name and some settings to apply to make the use of this component more convenient


#### Parameters
Name  |  Type  |  Description  |  Status  |  Default
------------  |  ------------  |  ------------  |  ------------  |  ------------
name  |  **{ [String](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/String) }**  |  The name of the layer  |  required  |
props  |  **{ [Object](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Object) }**  |  The properties to apply to this layer  |  required  |

#### Example
```js
	SParallaxComponent.registerLayer('background', {
  mouseX: 50,
  mouseY: 50
})
```
Author : Olivier Bossel [olivier.bossel@gmail.com](mailto:olivier.bossel@gmail.com) [https://olivierbossel.com](https://olivierbossel.com)

**Static**


### isEnabled

Return if the plugin is enabled or not

Return **{ [Boolean](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Objets_globaux/Boolean) }** true if enabled, false if not