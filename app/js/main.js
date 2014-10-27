require({
    baseUrl: 'js',
    paths: {
        'three': 'vendor/threejs/build/three',
        'OrbitControls': 'vendor/three.js-controls/src/OrbitControls',
        'TrackballControls': 'vendor/three.js-controls/src/TrackballControls',
        'keydrown': 'vendor/keydrown/dist/keydrown'
    },
    shim: {
        'three': { exports: 'THREE' },
        'OrbitControls': { deps: ['three'] },
        'TrackballControls': { deps: ['three'] },
        'keydrown': { exports: 'kd' }
    }
}, [
    'three',
    'player',
    'keydrown',
    'TrackballControls'
], function(THREE, Player, kd) {

// var camera, scene, renderer;
// var geometry, material, mesh;
// var camera2, cameraHelper;
var selectedCamera;
var maxAnisotropy = 0;
var GROUND_SIZE = 100;
var player = new Player();
window.player = player;
init();
requestAnimationFrame(mainLoop);

function setupRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMapEnabled = true;
    // renderer.shadowMapSoft = true;
    renderer.shadowMapType = THREE.PCFSoftShadowMap;


    renderer.shadowCameraNear = 3;
    renderer.shadowCameraFar = 1000;
    renderer.shadowCameraFov = 50;

    renderer.shadowMapBias = 0.0039;
    renderer.shadowMapDarkness = 0.5;
    renderer.shadowMapWidth = 2048;
    renderer.shadowMapHeight = 2048;
    maxAnisotropy = renderer.getMaxAnisotropy();
    document.getElementById('viewport').appendChild(renderer.domElement);
}

function setupLights(scene) {
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.x = 1200;
    light.position.y = 1500;
    light.position.z = 1000;
    light.castShadow = true;
    scene.add(light);
    scene.add( new THREE.AmbientLight( 0x212223) );
}

function init() {
    setupRenderer();

    scene = new THREE.Scene();
    scene.add(player);
    scene.add(player.cameraHelper);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = -400;
    camera.position.y = 250;
    camera.position.z = 500;
    selectedCamera = camera;

    controls = new THREE.TrackballControls(camera);
    controls.noPan = true;
    controls.damping = 0.2;
    controls.maxDistance = 2500;
    controls.target = player.position;

    var groundTexture = THREE.ImageUtils.loadTexture('img/grid.png');
    groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
    groundTexture.repeat.set(40, 40)
    groundTexture.anisotropy = maxAnisotropy;
    ground = new THREE.Mesh(
        new THREE.PlaneGeometry(1000,1000),
        new THREE.MeshLambertMaterial({
            color: 0xffffff,
            map: groundTexture,
        })
    );
    ground.material.side = THREE.DoubleSide;
    ground.rotation.x = -Math.PI/2;
    scene.add(ground);
    ground.receiveShadow = true;

    sky = new THREE.Mesh(
        new THREE.SphereGeometry(1000,1000, 32, 32),
        new THREE.MeshLambertMaterial({
            color: 0x3399CC,
        })
    );
    sky.material.side = THREE.BackSide;
    scene.add(sky);


    setupLights(scene);
    kd.C.press(swapCamera);
}

function swapCamera() {
    if (selectedCamera === camera) {
        selectedCamera = player.camera;
    } else {
        selectedCamera = camera;
    }
}

function updateScene(dt) {
    kd.tick();
    player.update(dt);
    controls.update();
}

var dt = 0;
var newTime = new Date(), prevTime = new Date();
function mainLoop() {
    prevTime = newTime;
    newTime = new Date();
    dt = newTime - prevTime;
    updateScene(dt / 1000);

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame(mainLoop);
    renderer.render(scene, selectedCamera);

}

});
