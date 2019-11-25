var publicImage = null;
var hiddenImage = null;
var combinedImage = null;
var restoredImage = null;
var publicImageWidth = 0;
var hiddenImageWidth = 0;
var publicCanvas;
var hiddenCanvas;
var combinedCanvas;
var restoredCanvas;

// var start = new SimpleImage("usain.jpg");
// var hide = new SimpleImage("skyline.jpg");

function mergedImage() {
  publicImageWidth = publicImage.getWidth();
  hiddenImageWidth = hiddenImage.getWidth();
  if (publicImageWidth !== hiddenImageWidth)  {
    alert("ERROR: Image size mismatch + Public: " + publicImageWidth + " Hidden: " + hiddenImageWidth);
    return;
  }
  console.log("public: ",publicImageWidth, "hidden: ", hiddenImageWidth);
  start = chop2hide(publicImage);
  hide = shift(hiddenImage);
  combinedImage = combine(start, hide);

  combinedCanvas = document.getElementById("canv3");
  combinedImage.drawTo(combinedCanvas);
  // print(stego);
}
function extractHiddenImage() {
  restoredImage = restore(combinedImage);
  restoredCanvas = document.getElementById("canv4");
  restoredImage.drawTo(restoredCanvas);
}

// The following line of code is for testing only.
// comparePixels(combinedImage, start, hide);

// Load the public facing image and image to be hidden in the public image
function loadPublicImage() {
  var imgFile = document.getElementById("public");
  publicImage = new SimpleImage(imgFile);
  publicCanvas = document.getElementById("canv1");
  publicImage.drawTo(publicCanvas);
}

function loadHiddenImage() {
  var imgFile = document.getElementById("hidden");
  hiddenImage = new SimpleImage(imgFile);
  hiddenCanvas = document.getElementById("canv2");
  hiddenImage.drawTo(hiddenCanvas);
}

function clearCanvas() {
  doClear(publicCanvas);
  doClear(hiddenCanvas);
  doClear(combinedCanvas);
  doClear(restoredCanvas);
}
function doClear(canvas) {
  var context = canvas.getContext("2d");
  context.clearRect(0,0,canvas.width,canvas.height);
}


// use on main image to hold hidden image
function clearbits(pixval) {
	var x = Math.floor(pixval/16) * 16;
	return x;
}

// Use to restore hidden image from combined imaged
function restorebits(pixval) {
    var x = (pixval % 16) * 16
	return x;
}

// use on image that will be hidden
function movebits(pixval) {
    var x = Math.floor(pixval/16);
    return x;
}

// extract 4 most significant bits of image that will do the hiding
// and move them over to left to give space for hidden image.
function chop2hide(image) {
	for (var px of image.values()){
		px.setRed(clearbits(px.getRed() ));
		px.setGreen(clearbits(px.getGreen() ));
		px.setBlue(clearbits(px.getBlue() ));
	}
	return image;
}

// Take image with combined images and extract the hidden image
function restore(image) {
    for (var px of image.values()){
        px.setRed(restorebits(px.getRed() ));
        px.setGreen(restorebits(px.getGreen() ));
        px.setBlue(restorebits(px.getBlue() ));
    }
    return image;
}

// take 4 most significant bits from image to be hidden
// These will be appended to the end of of bits from chop2hide
function shift(image) {
    for (var px of image.values()){
		px.setRed(movebits(px.getRed() ));
		px.setGreen(movebits(px.getGreen() ));
		px.setBlue(movebits(px.getBlue() ));
	}
	return image;
}

//Combine the bits from chop2hide and shift to create combined image
function combine(start, hide) {
    var output = new SimpleImage(start.getWidth(), start.getHeight());
    for (var px of output.values()){
    	    var x = px.getX();
    	    var y = px.getY();
    	    var startPixel = start.getPixel(x, y);
    	    var hidePixel = hide.getPixel(x, y);
    	    px.setRed(startPixel.getRed() + hidePixel.getRed());
    	    px.setGreen(startPixel.getGreen() + hidePixel.getGreen());
    	    px.setBlue(startPixel.getBlue() + hidePixel.getBlue());
    }
    return output; 
}

// This is a function for testing o compare the pixel coloras from the 3 images.
function comparePixels(final, start, hide) {
    print(hide);
    var count = 0;
     for (var px of final.values()){
         if (count <= 50) {
            var x = px.getX();
    	    var y = px.getY();
            var fPixel = final.getPixel(x, y);
            var sPixel = start.getPixel(x, y);
            var hPixel = hide.getPixel(x, y);
            print("Count is: ", count);
            print("final pixels are: " , fPixel);
            print("start pixels are: " , sPixel);
            print("hide pixels are: " , hPixel);
            count = count + 1;
         }
     }
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}