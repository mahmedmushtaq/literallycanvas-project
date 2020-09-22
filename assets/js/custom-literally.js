var lc = null;
var tools;
var strokeWidths;


var setCurrentByName;
var findByName;
let defaultFontFamily = "sans-serif", defaultFontSize = 16, defaultFontStyle='normal';

// the only LC-specific thing we have to do
var containerOne = document.getElementsByClassName('literally')[0];

const lcCanvas = () => {
  return lc.getImage({
    scale: 1,
    margin: { top: 10, right: 10, bottom: 10, left: 10 },
  });
};

function download() {
  var download = document.getElementById('download');
  var image = lcCanvas()
    .toDataURL('image/png')
    .replace('image/png', 'image/octet-stream');
  download.setAttribute('href', image);
}

var showLC = function () {
  const storageData = JSON.parse(localStorage.getItem('drawing'));


  lc = LC.init(containerOne, {
    snapshot: storageData,
    defaultStrokeWidth: 7,
    strokeWidths: [1, 3, 7, 10, 20, 30],
    backgroundColor: 'white',
    secondaryColor: 'transparent',
  });
  window.demoLC = lc;

  const canvas = lc.canvas;
  const ctx = canvas.getContext('2d');
  ctx.font = '38px Monospace';

 console.log(lc,'5763');



  $('#add-img-btn').on('click', function () {
    if (imgObj.src) {
      // hide anchors
      hideAnchors();

      stage.attrs.width = yodaImg.attrs.width + 150;
      stage.attrs.height = yodaImg.attrs.height + 150;

      const dataUrl = stage.toDataURL();
      const image = new Image();

      image.src = dataUrl;

      lc.saveShape(
        LC.createShape('Image', { x: 20, y: 20, image: image, scale: 1 })
      );

      showAnchors();
    }
  });

  var save = function () {
    localStorage.setItem('drawing', JSON.stringify(lc.getSnapshot()));
  };

  lc.on('drawingChange', save);
  lc.on('pan', save);
  lc.on('zoom', save);

  $('#open-image').click(function () {
    var win = window.open();
    const base64URL = lcCanvas().toDataURL();
    win.document.write(
      '<iframe src="' +
        base64URL +
        '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
    );
  });

  $('#clear-lc').click(function () {
    lc.clear();
  });

  $('#undo-lc').click(function () {
    lc.undo();
  });

  $('#redo-lc').click(function () {
    lc.redo();
  });

  // Set up our own tools...
  tools = [
    {
      name: 'pencil',
      el: document.getElementById('tool-pencil'),
      tool: new LC.tools.Pencil(lc),
    },
    {
      name: 'eraser',
      el: document.getElementById('tool-eraser'),
      tool: new LC.tools.Eraser(lc),
    },
    {
      name: 'text',
      el: document.getElementById('tool-text'),
      tool: new LC.tools.Text(lc),
    },
    {
      name: 'line',
      el: document.getElementById('tool-line'),
      tool: new LC.tools.Line(lc),
    },
    {
      name: 'arrow',
      el: document.getElementById('tool-arrow'),
      tool: (function () {
        arrow = new LC.tools.Line(lc);
        arrow.hasEndArrow = true;
        return arrow;
      })(),
    },
    {
      name: 'dashed',
      el: document.getElementById('tool-dashed'),
      tool: (function () {
        dashed = new LC.tools.Line(lc);
        dashed.isDashed = true;
        return dashed;
      })(),
    },
    {
      name: 'ellipse',
      el: document.getElementById('tool-ellipse'),
      tool: new LC.tools.Ellipse(lc),
    },
    {
      name: 'tool-rectangle',
      el: document.getElementById('tool-rectangle'),
      tool: new LC.tools.Rectangle(lc),
    },
    {
      name: 'tool-polygon',
      el: document.getElementById('tool-polygon'),
      tool: new LC.tools.Polygon(lc),
    },
    {
      name: 'tool-select',
      el: document.getElementById('tool-select'),
      tool: new LC.tools.SelectShape(lc),
    },
    {
      name: 'tool-pan',
      el: document.getElementById('tool-pan'),
      tool: new LC.tools.Pan(lc),
    },
    {
      name: 'tool-eye-dropper',
      el: document.getElementById('tool-eye-dropper'),
      tool: new LC.tools.Eyedropper(lc),
    },
  ];

  strokeWidths = [
    {
      name: 7,
      el: document.getElementById('sizeTool-7'),
      size: 7,
    },
    {
      name: 1,
      el: document.getElementById('sizeTool-1'),
      size: 1,
    },
    {
      name: 3,
      el: document.getElementById('sizeTool-3'),
      size: 3,
    },

    {
      name: 10,
      el: document.getElementById('sizeTool-10'),
      size: 10,
    },

    {
      name: 20,
      el: document.getElementById('sizeTool-20'),
      size: 20,
    },

    {
      name: 30,
      el: document.getElementById('sizeTool-30'),
      size: 30,
    },
  ];

  //lc.tool.strokeWidth = 2;

  // colors = [
  //   {
  //     name: 'black',
  //     el: document.getElementById('colorTool-black'),
  //     color: '#000000',
  //   },
  //   {
  //     name: 'blue',
  //     el: document.getElementById('colorTool-blue'),
  //     color: '#0000ff',
  //   },
  //   {
  //     name: 'red',
  //     el: document.getElementById('colorTool-red'),
  //     color: '#ff0000',
  //   },
  // ];

  setCurrentByName = function (ary, val) {
    ary.forEach(function (i) {
      $(i.el).toggleClass('current', i.name == val);
    });
  };

  findByName = function (ary, val) {
    var vals;
    vals = ary.filter(function (v) {
      return v.name == val;
    });
    if (vals.length == 0) return null;
    else return vals[0];
  };

  // Wire tools
  tools.forEach(function (t) {
    $(t.el).click(function () {
      var sw;

      lc.setTool(t.tool);
      setCurrentByName(tools, t.name);
      setCurrentByName(strokeWidths, t.tool.strokeWidth);
      $('#tools-sizes').toggleClass('disabled', t.name == 'text');
    });
  });
  setCurrentByName(tools, tools[0].name);

  // Wire Stroke Widths
  // NOTE: This will not work until the stroke width PR is merged...
  strokeWidths.forEach(function (sw) {
    $(sw.el).click(function () {
      lc.trigger('setStrokeWidth', sw.size);
      setCurrentByName(strokeWidths, sw.name);
    });
  });
  setCurrentByName(strokeWidths, strokeWidths[0].name);

  // Wire Colors
  // colors.forEach(function (clr) {
  //   $(clr.el).click(function () {
  //     lc.setColor('primary', clr.color);
  //     setCurrentByName(colors, clr.name);
  //   });
  // });
  // setCurrentByName(colors, colors[0].name);
};

$(document).ready(function () {
  // disable scrolling on touch devices so we can actually draw
  $(document).bind('touchmove', function (e) {
    if (e.target === document.documentElement) {
      return e.preventDefault();
    }
  });
  showLC();
});

$('#hide-lc').click(function () {
  if (lc) {
    lc.teardown();
    lc = null;
  }
});

$('#show-lc').click(function () {
  if (!lc) {
    showLC();
  }
});

//  color picker

// let's set defaults for all color pickers
jscolor.presets.default = {
  height: 181, // make the picker box a little bigger
  position: 'right', // position the picker to the right of the target
  previewPosition: 'right', // display color preview on the right side
  previewSize: 40, // make color preview bigger
};

const resetColor = () => {
  lc.setColor('primary', 'rgb(0,0,0)');
  lc.setColor('secondary', 'rgb(255,255,255)');
  lc.setColor('background', 'rgb(255,255,255)');
};

const strokeColorChange = (value) => {
  lc.setColor('primary', value.toHEXString());
};

const backgroundColor = (value) => {
  lc.setColor('background', value.toHEXString());
};

const fillColor = (value) => {
  lc.setColor('secondary', value.toHEXString());
};

const zoomIn = () => {
  lc.zoom(lc.config.zoomStep);

};

const zoomOut = () => {
  lc.zoom(-lc.config.zoomStep);
};



 $("#tool-text").on("click",function(){
   setTimeout(()=>{
     setTextFont()
   },100)
 })

const setTextFont = ()=>{
   if(lc.tool.font) {
     lc.tool.font = defaultFontStyle + " " + defaultFontSize + "px " + defaultFontFamily;
     console.log(lc.tool);
   }


}

$("#font-style").on("change",function(e){
    defaultFontStyle = e.target.value;
    setTextFont()
})

$("#font-family").on("change",function(e){
  defaultFontFamily = e.target.value;
  setTextFont()
})

$("#font-size").on("change",function(e){
  defaultFontSize = e.target.value;
  setTextFont()
})


