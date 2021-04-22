const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

//Help
if (process.argv[2] === undefined)
{
	console.log(`node . [pathtoimage]`);
	console.log(`Takes an image (png, jpg, etc.) and creates a flat 3d .obj format mesh based on the pixels in that image.\nAnything with an opacity of 0 will not be included.`);
	return;
}

//Just to define some basic channels
var imageChannels = ["r","g","b", "a"];

//Load in the image
var model = new sharp(process.argv[2]);
model.metadata((err, meta)=>
{
	//Poor error handling, but oh well
	if (err) return console.log(err);

	//To a raw buffer
	model.raw().toBuffer((err, data)=>
	{
		//Poor error handling, but oh well
		if (err) return console.log(err);

		//Process the raw buffer
		console.log(`${data.length} bytes (${data.length / meta.channels} pixels) of data`);
		var imageRGB = [];
		for (var y = 0; y < meta.height; y++)
			imageRGB[meta.height-1-y] = [];
		for (var y = 0; y < meta.height; y++)
		{
			for (var x = 0; x < meta.width; x++)
			{
				var pixelColor = data[(y * meta.width * meta.channels) + (x * meta.channels) + 0];
				for (var c = 1; c < meta.channels; c++)
				{
					if (typeof pixelColor !== "object")
						pixelColor = {"r": pixelColor};

					pixelColor[imageChannels[c]] = data[(y * meta.width * meta.channels) + (x * meta.channels) + c];
				}
				imageRGB[meta.height-1-y][x] = pixelColor;
			}
		}

		//Build up the vert data
		var uv = [], verts = [], faces = [];
		for (var y = 0; y < meta.height; y++)
		for (var x = 0; x < meta.width; x++)
		{
			//Transparent? ignore
			if (imageRGB[y][x].a === 0)// || (imageRGB[y][x].r === 255 && imageRGB[y][x].g === 255 && imageRGB[y][x].b === 255))
				continue;

			// console.log(`${x},${y}: ${JSON.stringify(imageRGB[y][x])}`);
			//Build up verts, uv and faces
			verts.push([x  ,y  ,0]);
			verts.push([x+1,y  ,0]);
			verts.push([x+1,y+1,0]);
			verts.push([x  ,y+1,0]);
			uv.push([(x+0.000025)/(meta.width), (y+0.00025)/(meta.height), 0]);
			uv.push([(x+0.999975)/(meta.width), (y+0.00025)/(meta.height), 0]);
			uv.push([(x+0.999975)/(meta.width), (y+0.99975)/(meta.height), 0]);
			uv.push([(x+0.000025)/(meta.width), (y+0.99975)/(meta.height), 0]);
			faces.push([verts.length-3, verts.length-2, verts.length-1]);
			faces.push([verts.length-3, verts.length-1, verts.length]);
		}

		//Create the obj text
		var objtxt =     "#verts\n" + verts.map((f)=>{return `v ${f.join(" ")}` }).join("\n")
				   + "\n\n#uvs\n"   +    uv.map((f)=>{return `vt ${f.join(" ")}` }).join("\n")
				   + `\n\no ${path.parse(process.argv[2]).name}`
				   + `\n\ng ${path.parse(process.argv[2]).name}`
				   + "\n\n#faces\n" + faces.map((f)=>{return `f ${f.map((g)=>{return g + "/" + g;}).join(" ")}` }).join("\n");

		//Write it
		console.log(`Writing to ${path.parse(process.argv[2]).name}.obj in ${path.parse(process.argv[2]).dir || "."}`);
		fs.writeFile(`${path.join(path.parse(process.argv[2]).dir, path.parse(process.argv[2]).name)}.obj`, objtxt, (err)=>
		{
			//Poor error handling, but oh well
			if (err) return console.log(err);
		});
	});

});