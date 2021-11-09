
document.addEventListener("DOMContentLoaded", function(event) { 
  //const ImageToColors = (...args) => import('image-to-colors').then(({default: ImageToColors}) => ImageToColors(...args));
  const html2canvas = require("html2canvas")
  function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }
  
  function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

    ProcessFileIcon.onclick = PrcoessFile

    function SetProgress(Progresss) {
      document.getElementById("processbar").value = Progresss
    }

    function PrcoessFile() {
        document.getElementById("LoadingIcon").style.display = "block"
        document.getElementById("ProcessFileIcon").style.display = "none"
        document.getElementById("FileUploadTitle").style.display = "none"
        document.getElementById("upload").style.display = "none"
        document.getElementById("FileUploadWarning").style.display = "none"

        document.getElementById("ImagePreview").classList.add("Processing-Img")
        document.getElementById("processbar").classList.add("FadeIn-FX")
        document.getElementById("File-Upload-Inner").classList.add("Processing-FileUpload")
        document.getElementById("Configs").style.display = "none"

        console.log("Converting Canvas..")
        let RenderAmount = parseInt(document.getElementById('Render-Amount').value)
        html2canvas(document.getElementById("ImagePreview")).then(canvas => {
          console.log("Getting Colors")
          SetProgress(25)
          let colors = []
          console.log(canvas)
          var ctx = canvas.getContext('2d');
          for (let x = 0; x < canvas.width; x = x + RenderAmount) {
            let CurrentColorRow = []
            for (let y = 0; y < canvas.height; y = y + RenderAmount) {
              var p = ctx.getImageData(x, y, 1, 1).data; 
              var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
              CurrentColorRow.push(hex.toUpperCase())

            }

            colors.push(CurrentColorRow)
          }

          SetProgress(50)
          console.log("Converting into Polytoria Map File..")
          let ProcessXMLFile = `<?xml version="1.0" encoding="UTF-8"?><game><Item class="Environment"><Properties><string name="name">Environment</string></Properties>
          `

          let CurrentPositionX = 0
          let CurrentPositionZ = 0

          colors.forEach(function (item, index) {
            item.forEach(function (item2, index2) {
              ProcessXMLFile = ProcessXMLFile + `<Item class="Part">
<Properties>
        <string name="name">Part</string>
        <vector3 name="position">
          <X>${CurrentPositionX}</X>
          <Y>0.00</Y>
          <Z>${CurrentPositionZ}</Z>
        </vector3>
        <vector3 name="rotation">
          <X>0.00</X>
          <Y>0.00</Y>
          <Z>0.00</Z>
        </vector3>
        <vector3 name="scale">
          <X>1.00</X>
          <Y>1.00</Y>
          <Z>1.00</Z>
        </vector3>
        <string name="color">${item2}</string>
        <string name="shape">cube</string>
        <int name="material">0</int>
        <boolean name="anchored">true</boolean>
        <boolean name="canCollide">true</boolean>
        <boolean name="isSpawn">false</boolean>
        <boolean name="hideStuds">true</boolean>
            </Properties>
            </Item>
            `
            CurrentPositionX = CurrentPositionX + 1
          });
          CurrentPositionX = 0
          CurrentPositionZ = CurrentPositionZ + 1
          });
          ProcessXMLFile = ProcessXMLFile + `</Item></game>
          `          
          SetProgress(75)
          var file = new Blob([ProcessXMLFile], {type: ""})
          let thelink = URL.createObjectURL(file)
          console.log(thelink)
          var element = document.createElement('a');
          element.setAttribute('href', thelink);
          element.setAttribute('download', 'Converted Place.ptm');

          element.style.display = 'none';
          element.click();
          SetProgress(100)
          setTimeout(() => {
            document.location.reload();

          }, 3000);

        })

        /*
        const myColors = ImageToColors.get(myImage);
        console.log(myColors)*/
    }
    
    function handleFileSelect(evt) {
    let files = evt.target.files; // FileList object
    
    // use the 1st file from the list
    let f = files[0];
    
    let reader = new FileReader();
    
    // Closure to capture the file information.
    reader.onload = (function(theFile) {
    return function(e) {
      document.getElementById("ImagePreview").src = e.target.result;
    
    };
    })(f);
    
    reader.addEventListener("load", function(e) {
    document.getElementById("ImagePreview").src = e.target.result;
    }); 
    
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
    }
    
    document.getElementById('upload').addEventListener('change', handleFileSelect, false);
  });