# imagetoobj
Takes an image (png, jpg, etc.) and creates a flat 3d .obj format mesh based on the pixels in that image. Anything with an opacity of 0 will not be included.

## Installation ##

* Grab the files from the repository
* Use npm to install dependencies (```npm i``` from command line in folder you downloaded to)

## Usage ##
Use from the command line with *node . [pathtofile]*. For example:

`node . "C:\\Users\\Documents\\Rodney\\Pictures\\coolpicture.png"`  
_This example would generate  **coolpicture.obj** in "C:\\Users\\Documents\\Rodney\\Pictures\\"_

Here's an example of the output from a provided sprite (with transparency). It can then be refined and extruded in your favorite 3D software:

![Example](https://github.com/blakejrobinson/imagetoobj/blob/main/examples.jpg?raw=true)