var controls, scene, camera;
var myTypography;
var stats = initStats();

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.set(0, 0, 2000);
    camera.lookAt(new THREE.Vector3(0, 100, 0));
    scene = new THREE.Scene();
    controls = new THREE.TrackballControls(camera, render.domElement);
   
    myTypography = new typography();
    myTypography.addWord("I wish will be butterfly"); 
    animate();
    
    valuesChanger = function() {
        myTypography.valuesChanger();
    };
    var gui = new dat.GUI();
    //gui.add( myTypography.variablesController, "radiusFactor", 0.0, 5.0, 1.0 ).onChange( valuesChanger );
    initStats();
}

function animate() {
    requestAnimationFrame(animate);
    render();
    stats.update();
}

function render() {
    controls.update();
    renderer.render(scene, camera);
}

function newWishInput(){
    myTypography.unload();
    myTypography = new typography();
    alert("wishText:"+document.getElementById('wishText').value);
    myTypography.addWord(document.getElementById('wishText').value);
}

function initStats() {

    stats = new Stats();

    stats.setMode(0); // 0: fps, 1: ms

    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.body.appendChild(stats.domElement);

    return stats;
}