var width = window.innerWidth;
var height = window.innerHeight;

function update(activeAnchor) {
  var group = activeAnchor.getParent();

  var topLeft = group.get('.topLeft')[0];
  var topRight = group.get('.topRight')[0];
  var bottomRight = group.get('.bottomRight')[0];
  var bottomLeft = group.get('.bottomLeft')[0];
  var image = group.get('Image')[0];

  var anchorX = activeAnchor.getX();
  var anchorY = activeAnchor.getY();

  // update anchor positions
  switch (activeAnchor.getName()) {
    case 'topLeft':
      topRight.y(anchorY);
      bottomLeft.x(anchorX);
      break;
    case 'topRight':
      topLeft.y(anchorY);
      bottomRight.x(anchorX);
      break;
    case 'bottomRight':
      bottomLeft.y(anchorY);
      topRight.x(anchorX);
      break;
    case 'bottomLeft':
      bottomRight.y(anchorY);
      topLeft.x(anchorX);
      break;
  }

  image.position(topLeft.position());

  var width = topRight.getX() - topLeft.getX();
  var height = bottomLeft.getY() - topLeft.getY();
  if (width && height) {
    image.width(width);
    image.height(height);
  }
}
function addAnchor(group, x, y, name, anchorRadius) {
  var stage = group.getStage();
  var layer = group.getLayer();

  var anchor = new Konva.Circle({
    x: x,
    y: y,
    stroke: '#666',
    fill: '#ddd',
    strokeWidth: 2,
    radius: anchorRadius || 8,
    name: name,
    draggable: true,
    dragOnTop: false,
  });

  anchor.on('dragmove', function () {
    update(this);
    layer.draw();
  });
  anchor.on('mousedown touchstart', function () {
    group.draggable(false);
    this.moveToTop();
  });
  anchor.on('dragend', function () {
    group.draggable(true);
    layer.draw();
  });
  // add hover styling
  anchor.on('mouseover', function () {
    var layer = this.getLayer();
    document.body.style.cursor = 'pointer';
    this.strokeWidth(4);
    layer.draw();
  });

  anchor.on('mouseout', function () {
    var layer = this.getLayer();
    document.body.style.cursor = 'default';
    this.strokeWidth(2);
    layer.draw();
  });

  group.add(anchor);
}

var stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
});

var layer = new Konva.Layer();
stage.add(layer);

var yodaImg = new Konva.Image({
  width: 93,
  height: 104,
});

var yodaGroup = new Konva.Group({
  x: 20,
  y: 110,
  draggable: true,
});
layer.add(yodaGroup);

yodaGroup.add(yodaImg);
addAnchor(yodaGroup, 0, 0, 'topLeft');
addAnchor(yodaGroup, 93, 0, 'topRight');
addAnchor(yodaGroup, 93, 104, 'bottomRight');
addAnchor(yodaGroup, 0, 104, 'bottomLeft');

function showAnchors() {
  yodaGroup.find('Circle').show();
  layer.draw();
}

function hideAnchors() {
  yodaGroup.find('Circle').hide();
  layer.draw();
}

yodaGroup.on('mouseenter', showAnchors);
yodaGroup.on('mouseleave', hideAnchors);

var imgObj = new Image();
imgObj.onload = function () {
  yodaImg.image(imgObj);
  layer.draw();
};

if (!imgObj.src) {
  $('#container').hide();
}

$('#upload-photo').change(function (e) {
  const url = URL.createObjectURL(e.target.files[0]);
  imgObj.src = url;
  $('#container').show();
});
