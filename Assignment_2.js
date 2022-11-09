//Eoghan Ó Riain - 111319036
//CS6105 - Future and Emerging Interaction Technologies

//Table Of Content:
// 25-36   --Loading Libraries
// 38-55   --Declaring Variables
// 57-72   --Definitions for physics library functionality
// 74-78   --Adding system monitoring panel for the user interface
// 80-92   --Creating camera
// 94-99   --Creating the scene
// 101-114 --Adding ambient audio
// 116-187 --Creating light source and adding it to the scene
// 189-228 --Adding external physics library Cannon-es
// 230-294 --Adding a textured ground floor to the scene for character interaction
// 296-329 --Adding a video file display to the scene using PlaneGeometry
// 331-394 --Adding shaders to the scene
// 396-436 --Creating a GUI
// 438-460 --Adding a scene renderer
// 462-473 --Adding a HDRI to the scene
// 475-497 --Adding stars to the scene using spheregeometry randomly dispersed
// 499-654 --Loading external models to the scene
// 656-698 --Applying animation to the scene
// 700-726 --Initialising the functions

////////////////////////////////////////////////////////////////////////////////
//-------------Loading Libraries--------------
import * as THREE from './Libs/three.module.js';
import * as CANNON from './Libs/cannon-es.js'
import { OrbitControls } from './Libs/OrbitControls.js';
import { ColladaLoader } from './Libs/ColladaLoader.js';
import { GUI } from './Libs/DAT.GUI/dat.gui.module.js';
import { VRButton } from './Libs/VRButton.js';
import { RGBELoader } from './Libs/RGBELoader.js';
import { FBXLoader } from './Libs/FBXLoader.js';
import Stats from './Libs/stats.module.js';
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Declaring Variables--------------
// Declarations listedbelow are used throughout the following code
let aspectRatio = (window.innerWidth / window.innerHeight);
let scene, camera, renderer, controls;
let quad, asteroid, ship, sofa, mixer, mixer1;
let uniforms = {u_time: { type: "f", value: 1.0 }};
var stars = [];
var mesh, mesh1, mesh2, mesh3;
const loadingManager = new THREE.LoadingManager();
const container = document.getElementById( 'container' );
const stats = Stats();
const listener = new THREE.AudioListener();
const sound = new THREE.Audio( listener );
const posSound = new THREE.PositionalAudio ( listener );
const textureLoader = new THREE.TextureLoader();
const clock = new THREE.Clock();
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Definitions for physics library functionality--------------
const world = new CANNON.World();
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const sphereGeometry = new THREE.SphereGeometry();
const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: document.getElementById("vertexShader1").textContent,
  fragmentShader: document.getElementById("fragmentShader1").textContent
});
const cubeMesh = new THREE.Mesh(cubeGeometry, shaderMaterial);
const sphereMesh = new THREE.Mesh(sphereGeometry, shaderMaterial);
//Applying mass to the 3D object. This will effect the impact of gravity on the object
const cubeBody = new CANNON.Body({ mass: 1 })
const sphereBody = new CANNON.Body({ mass: 1 })
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding system monitoring panel for the user interface--------------
stats.showPanel( 0, 1, 2 ); // 0 = fps, 1 = ms, 2 = mb
container.appendChild(stats.dom);
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Creating camera--------------
function createCamera() {
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  //instructing the camera to be position at a more acceptable starting point
  camera.position.x = -10;
  camera.position.y = 35;
  camera.position.z = -50;
  //adding orbital controls to allow the user to manimulate the position of the camera
  controls = new OrbitControls(camera, renderer.domElement);
  camera.add( listener );
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Creating the scene--------------
function createScene() {
  scene = new THREE.Scene();
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding ambient audio --------------
function createAmbientSound(){
   const audioLoader = new THREE.AudioLoader();
   audioLoader.load('./Assets/traveling-through-space-3281.mp3', function (buffer) {
   sound.setBuffer(buffer);
   //Setting the ambient audio to play on a loop indefinitely
   sound.setLoop(true);
   //Adjusting the ambient audio volume
   sound.setVolume(0.25);
   sound.play();
});
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Creating light source and adding it to the scene--------------
function createLight(){

  //Light source no.1 - Ambient Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.12);
  scene.add(ambientLight);

  //Light source no.2 - Spotlight
  //Used to illuminate the video screen
  //defining spotlight arguments
  const spotLight1 = new THREE.SpotLight(0xffffff, 5, 100, 0.8, 1, 5);
  //creatinng a target for the spotlight
  const targetObject1 = new THREE.Object3D();
  scene.add(targetObject1);
  //positioning the spotlight source
  spotLight1.position.set(0, 0, 0);
  spotLight1.target = targetObject1;
  //positioning the target
  targetObject1.position.set(25.00, 11.00, 24.00);
  //instructing light to cast shadows
  spotLight1.castShadow = true;
  //defining parameters of the spotlight shadow
  spotLight1.shadow.mapSize.width = 512;
  spotLight1.shadow.mapSize.height = 512;
  spotLight1.shadow.camera.near = 0.1;
  spotLight1.shadow.camera.far = 100;
  spotLight1.shadow.camera.left = 5;
  spotLight1.shadow.camera.right = -5;
  spotLight1.shadow.camera.top = 5;
  spotLight1.shadow.camera.bottom = -5;
  scene.add(spotLight1);

  //Light source no.3 - Spotlight
  //notes as per the previous spotlight
  const spotLight2 = new THREE.SpotLight(0xffffff, 6, 100, 1.45, 1, 2);
  const targetObject3 = new THREE.Object3D();
  scene.add(targetObject3);
  spotLight2.position.set(17.95, 10.95, 24.00);
  spotLight2.target = targetObject3;
  targetObject3.position.set(7.1,0.05,0);
  spotLight2.castShadow = true;
  spotLight2.shadow.mapSize.width = 512;
  spotLight2.shadow.mapSize.height = 512;
  spotLight2.shadow.camera.near = 0.1;
  spotLight2.shadow.camera.far = 100;
  spotLight2.shadow.camera.left = 5;
  spotLight2.shadow.camera.right = -5;
  spotLight2.shadow.camera.top = 5;
  spotLight2.shadow.camera.bottom = -5;
  scene.add(spotLight2);

  //Light source no.4 - Directional Light
  //notes are as per spotlight
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  const targetObject2 = new THREE.Object3D();
  directionalLight.position.set(80,70,75);
  scene.add(targetObject2);
  directionalLight.target = targetObject2;
  directionalLight.target.position.set(8,0,0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 512;
  directionalLight.shadow.mapSize.height = 512;
  directionalLight.shadow.camera.near = 0.1;
  directionalLight.shadow.camera.far = 300;
  directionalLight.shadow.camera.left = 60;
  directionalLight.shadow.camera.right = -60;
  directionalLight.shadow.camera.top = 60;
  directionalLight.shadow.camera.bottom = -40;
  scene.add( directionalLight );
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding external physics library Cannon-es--------------
function physicsBodies(){
  world.gravity.set(0, -9.81, 0)
  //defining the details of the cube to be added to the scene, i.e. shadow and position
  cubeMesh.position.x = -3
  cubeMesh.position.y = 3
  cubeMesh.castShadow = true
  cubeMesh.receiveShadow = true;
  scene.add(cubeMesh)
  //Applying the physics element to the 3D object
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5))
  cubeBody.addShape(cubeShape)
  cubeBody.position.x = cubeMesh.position.x
  cubeBody.position.y = cubeMesh.position.y
  cubeBody.position.z = cubeMesh.position.z
  world.addBody(cubeBody)

  //defining the details of the sphere to be added to the scene, i.e. shadow and position
  sphereMesh.position.x = -1
  sphereMesh.position.y = 3
  sphereMesh.castShadow = true
  sphereMesh.receiveShadow = true;
  scene.add(sphereMesh)
  //Applying the physics element to the 3D object
  const sphereShape = new CANNON.Sphere(1)
  sphereBody.addShape(sphereShape)
  sphereBody.position.x = sphereMesh.position.x
  sphereBody.position.y = sphereMesh.position.y
  sphereBody.position.z = sphereMesh.position.z
  world.addBody(sphereBody)

  //Applying the physics element to the plane
  const planeShape = new CANNON.Plane()
  const planeBody = new CANNON.Body({ mass: 0 })
  planeBody.addShape(planeShape)
  planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2)
  world.addBody(planeBody)
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding a textured ground floor to the scene for character interaction--------------
function groundFloor(){
  //defining my ground floor
  const floorMat = new THREE.MeshStandardMaterial( {roughness:0.63} )
        // Adding colour texture map to the plane
				textureLoader.load( "./Assets/CobblestoneArches002/CobblestoneArches002_COL_VAR1_1K.jpg", function ( map ) {
          //wrap the text to the plane
					map.wrapS = THREE.RepeatWrapping;
					map.wrapT = THREE.RepeatWrapping;
          //adjust the anisitropy to pronounce the texture
					map.anisotropy = 4;
          //instruct the texture to repeat across the plane
					map.repeat.set( 10, 30 );
					map.encoding = THREE.sRGBEncoding;
					floorMat.map = map;
					floorMat.needsUpdate = true;
        });
        // Adding Normal texture map to the plane
        textureLoader.load( "./Assets/CobblestoneArches002/CobblestoneArches002_NRM_1K.jpg", function ( map ) {
          //wrap the text to the plane
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          //adjust the anisitropy to pronounce the texture
          map.anisotropy = 16;
          //instruct the texture to repeat across the plane
          map.repeat.set( 10, 30 );
          floorMat.normalMap = map;
          floorMat.needsUpdate = true;
        } );
        // Adding AO texture map to the plane
        textureLoader.load( "./Assets/CobblestoneArches002/CobblestoneArches002_AO_1K.jpg", function ( map ) {
          //wrap the text to the plane
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          //adjust the anisitropy to pronounce the texture
          map.anisotropy = 16;
          //instruct the texture to repeat across the plane
          map.repeat.set( 10, 30 );
          floorMat.aoMap = map;
          floorMat.aoMapIntensity = 1.0;
          floorMat.needsUpdate = true;
        } );
        // Adding displacement texture map to the plane
        textureLoader.load( "./Assets/CobblestoneArches002/CobblestoneArches002_DISP_1K.jpg", function ( map ) {
          //wrap the text to the plane
          map.wrapS = THREE.RepeatWrapping;
          map.wrapT = THREE.RepeatWrapping;
          //adjust the anisitropy to pronounce the texture
          map.anisotropy = 16;
          //instruct the texture to repeat across the plane
          map.repeat.set( 10, 30 );
          floorMat.roughnessMap = map;
          floorMat.needsUpdate = true;
        } );
  //define the characteristics of the plane, i.e. position, orientation and shadow.
  const geometry = new THREE.PlaneGeometry( 75, 95, 1, 3 );
  const groundFloor = new THREE.Mesh( geometry, floorMat );
  groundFloor.position.set(7, 0, 0);
  groundFloor.rotation.set(1.57, 3.14, 2.05);
  groundFloor.receiveShadow = true;
  groundFloor.material.side = THREE.DoubleSide;
  scene.add( groundFloor );
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding a video file display to the scene using PlaneGeometry--------------
function videoBoard(){
  //calling the video source defined in the html file
  const video = document.getElementById('video');
  //apply the video to a texture
  const videoTexture = new THREE.VideoTexture(video);
  //define two textures for two planes
  const videoMaterial =  new THREE.MeshPhongMaterial( {map:videoTexture, side: THREE.FrontSide} );
  const material = new THREE.MeshBasicMaterial( {color: 'brown', side: THREE.DoubleSide} );
  //define two sizes for two planes
  const geometry1 = new THREE.PlaneGeometry( 30, 15 );
  const geometry2 = new THREE.PlaneGeometry( 33, 18 );
  //apply the textures and sizes to their respective planes
  const billboard1 = new THREE.Mesh(geometry1, videoMaterial);
  const billboard2 = new THREE.Mesh(geometry2, material);
  //define the characteristics of the planes, i.e. position, orientation and shadow.
  billboard1.position.set(18.00, 11.00, 24.00);
  billboard1.rotation.set(0.0,-2.6, 0.0);
  billboard1.castShadow = false;
  billboard1.receiveShadow = true;
  billboard2.position.set(18.10, 11.10, 24.00);
  billboard2.rotation.set(0.0,-2.6, 0.0);
  billboard2.castShadow = true;
  billboard2.receiveShadow = true;
  scene.add( billboard1 );
  scene.add( billboard2 );
  //instruct the video to play on a loop
  video.loop = true;
  video.play();
  //Log a string to the console
  console.log('Video successfully loaded.');
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding shaders to the scene--------------

//Shader no.1 created with its corresponding vertex and fragment shaders called from the html file.
function shader1(){
  var shaderProp1 = {
    uniforms: {
      colour_dark: {type: 'v4', value: new THREE.Vector4(0.1, 0.9, 0.6, 1)},
      temp: {type: 'f', value: 1}
    },
    vertexShader: document.getElementById('vertexShader0').textContent,
    fragmentShader: document.getElementById('fragmentShader0').textContent
  };
  //Applying the shaders to a 3D Object
  var shaderMat = new THREE.ShaderMaterial(shaderProp1);
  var geometry = new THREE.SphereGeometry(2, 32, 32);
  mesh1 = new THREE.Mesh(geometry, shaderMat);
  mesh1.position.set(-7,26.2,60);
  scene.add(mesh1);
  //Log a string to the console
  console.log('First Shader successfully loaded.');
}

//Shader no.2 created with its corresponding vertex and fragment shaders called from the html file.
function shader2(){
  var shaderProp2 = {
    vertexShader: document.getElementById('vertexShader1').textContent,
    fragmentShader: document.getElementById('fragmentShader1').textContent
  };
  //Applying the shaders to a 3D Object
  var shaderMat = new THREE.ShaderMaterial(shaderProp2);
  var geometry = new THREE.ConeGeometry(10, 40, 45);
  mesh2 = new THREE.Mesh(geometry, shaderMat);
  mesh2.position.set(-7,8,60);
  scene.add(mesh2);
  //Log a string to the console
  console.log('Second Shader successfully loaded.');

  uniforms.u_time.value += 0.05;
}

//Shader no.2 created with its corresponding vertex and fragment shaders called from the html file.
function shader3(){
  let shaderMaterial =  new THREE.ShaderMaterial({
    uniforms: {
      iTime: {value:0},
      iChannel0:{value:textureLoader.load("./Assets/cloud.png")},
      iChannel1:{value:textureLoader.load("./Assets/lavatile.jpg")}
    },
    fragmentShader: document.getElementById('fragmentShader2').textContent,
    vertexShader: document.getElementById('vertexShader2').textContent,
    wireframe: false
  });
  //Applying the shaders to a 3D Object
  var geometry = new THREE.SphereGeometry(10, 32, 32);
  var mesh3 = new THREE.Mesh(geometry,shaderMaterial);
  mesh3.position.set(80,70,75);
  scene.add(mesh3);
  //Log a string to the console
  console.log('Third Shader successfully loaded.');

  shaderMaterial.uniforms.iTime.value += 0.01;
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Creating the spatialised sound source and gravity that can be manipulated by the user with a GUI--------------
function createUtils(){
// Axes Helper - Used to assist with object positioning specitication
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

// GUI creation
  const gui = new GUI();

  //Adding On and Off control for the ambient audio
  const soundFolder1 = gui.addFolder("Ambient Audio");
  const playObj1 = { play:function(){ sound.play() }};
  const stopObj1 = { stop:function(){ sound.stop() }};
  soundFolder1.add(stopObj1,'stop');
  soundFolder1.add(playObj1,'play');
  soundFolder1.open();

  //Adding On and Off control for the positional audio
  const soundFolder2 = gui.addFolder("Positional Audio");
  const playObj2 = { play:function(){ posSound.play() }};
  const stopObj2 = { stop:function(){ posSound.stop() }};
  soundFolder2.add(stopObj2,'stop');
  soundFolder2.add(playObj2,'play');
  soundFolder2.open()

  //Adding a button to mute all audio in the scene
  const allAudioFolder = gui.addFolder("All Audio");
  const muteObj = { stop:function(){
    posSound.isPlaying || sound.isPlaying ? listener.setMasterVolume(0) : listener.setMasterVolume(1) }};
  allAudioFolder.add(muteObj,'stop').name("Mute All");
  allAudioFolder.open()

  //Adding slider control to adjust the gravity in the scene
  const physicsFolder = gui.addFolder('Physics')
   physicsFolder.add(world.gravity, 'x', -10.0, 10.0, 0.1)
   physicsFolder.add(world.gravity, 'y', -10.0, 10.0, 0.1)
   physicsFolder.add(world.gravity, 'z', -10.0, 10.0, 0.1)
   physicsFolder.open()
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding a scene renderer--------------
function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  //allow shadows to occur
  renderer.shadowMap.enabled = true;
  //specify shadow type
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  //specify the mapping componants
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.6;
  renderer.outputEncoding = THREE.sRGBEncoding
  //defining the xr elements
  renderer.xr.setReferenceSpaceType('local');
  renderer.xr.setFoveation(0.01);
  renderer.xr.enabled = true;
  //adding VR Button to enable WebXR
  document.body.appendChild(VRButton.createButton(renderer));
  container.appendChild( renderer.domElement );
  window.addEventListener('resize', onWindowResize, false);
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding a HDRI to the scene--------------
  new RGBELoader()
    .load("./Assets/spaced.hdr", function(texture){
      //adding HDRI as a texture to the scene background and environment
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
      scene.environment = texture;
      console.log('HDRI successfully loaded.');
    });
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Adding stars to the scene using spheregeometry randomly dispersed--------------
function addSphere(){
      //loop to move from z position of -1000 to z position 1000, adding a random particle at each position.
      for ( var z= -1000; z < 1000; z+=20 ) {
        //Adding a sphere
        var geometry   = new THREE.SphereGeometry(1, 32, 32)
        var material = new THREE.MeshBasicMaterial( {color: 0xffffff} );
        var sphere = new THREE.Mesh(geometry, material)
        //Randomly positing the spheres with and x & y value between -500 and 500
        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;
        //Set the z position to where it is in the loop
        sphere.position.z = z;
        //Scale up the sphere to make it visible and slightly distorted
        sphere.scale.x = sphere.scale.y = 2;
        //Add the sphere to the scene
        scene.add( sphere );
        //Push the sphere to the stars array
        stars.push(sphere);
      }
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Loading external models to the scene--------------
function loadModel(){
	//Use ColladaLoader to load .dae model to the scene
	var loader_1 = new ColladaLoader(loadingManager);
  //Load the Quad Model
  loader_1.load('./Assets/UCC_Quad_Model_DAE/quad.dae', function(collada){
    quad = collada.scene;
    //apply shadow specification to the model
    quad.traverse(function(node){
      if (node instanceof THREE.Mesh){
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });
    //Add the model to the scene
    scene.add(quad);
    //Log sting to the console
    console.log('UCC Quad model successfully loaded.');
  });

  //Use FBXLoader to load .fbx model to the scene
  const loader_2 = new FBXLoader();
  //Load the Asteroid Model
  loader_2.load( './Assets/Asteroid/2012DA14.FBX', function ( asteroid ) {
    //apply shadow specification to the model
    asteroid.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    //Specify the characteristics of the model
    asteroid.position.set(30.0,-65.4,-20.0);
    asteroid.rotation.set(3.14,1,3.1);
    asteroid.scale.set(7, 7, 7);
    //Add the model to the scene
    scene.add( asteroid );
    //Log sting to the console
    console.log('Asteroid successfully loaded.');
  } );

  //Use FBXLoader to load .fbx model to the scene
  const loader_4 = new FBXLoader();
  //Load the UFO Model
  loader_4.load( './Assets/ufo2.fbx', function ( ship ) {
    //apply shadow specification to the model
    ship.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    //Specify the characteristics of the model
    ship.position.set(-7,25,60);
    ship.rotation.set(0,0,0);
    ship.scale.set(0.02, 0.02, 0.02);
    //Add the model to the scene
    scene.add( ship );
    //Log sting to the console
    console.log('UFO successfully loaded.');
    //Adding positional audio to the UFO model
    const audioLoader2 = new THREE.AudioLoader();
    audioLoader2.load ('./Assets/XWing-flyby-4.mp3', function (buffer) {
      posSound.setBuffer(buffer);
      //set the positional audio to play on a loop
      posSound.setLoop(true);
      //Adjust the volume of the audio
      posSound.setVolume(10);
      posSound.play();
      });
      ship.add(posSound);
    });

    //Use FBXLoader to load .fbx model to the scene
    const loader_5 = new FBXLoader();
    //Load the sofa Model
    loader_5.load( './Assets/sofa/Sofa_01_1k.fbx', function ( sofa ) {
      //apply shadow specification to the model
      sofa.traverse( function ( child ) {
        if ( child instanceof THREE.Mesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );
      //Specify the characteristics of the model
      sofa.position.set(7.1,0.05,0);
      sofa.rotation.set(0,0.4,0);
      sofa.scale.set(0.025,0.025,0.025);
      //Add the model to the scene
      scene.add( sofa );
      //Log sting to the console
      console.log('Sofa successfully loaded.');
      });

}
function loadAvatar1(){
  //Use FBXLoader to load .fbx model to the scene
  const loader_3 = new FBXLoader();
  //Adding animated Avatar_1 (Spaceman)
  loader_3.load( './Assets/Spaceman/SittingLaughing.fbx', function ( avatar1 ) {
    //apply the animation to the model
    mixer = new THREE.AnimationMixer( avatar1 );
    const action = mixer.clipAction( avatar1.animations[ 0 ] );
    action.play();
    //apply shadow specification to the model
    avatar1.traverse( function ( child ) {
      if ( child instanceof THREE.Mesh ) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    } );
    //Specify the characteristics of the model
    avatar1.position.set(8,0,0);
    avatar1.rotation.set(0,0.4,0);
    avatar1.scale.set(0.02,0.02,0.02);
    //Add the model to the scene
    scene.add( avatar1 );
    //Log sting to the console
    console.log('First Avatar successfully loaded.');

  } );
}
function loadAvatar2(){
  //Use FBXLoader to load .fbx model to the scene
  const loader_6 = new FBXLoader();
  //Adding animated Avatar_2 (Alien)
  loader_6.load( './Assets/Alien/StandingClap(1).fbx', function ( avatar2 ) {
    //apply the animation to the model
    mixer1 = new THREE.AnimationMixer( avatar2 );
    const action = mixer1.clipAction( avatar2.animations[ 0 ] );
    action.play();
    //apply shadow specification to the model
    avatar2.traverse( function ( child1 ) {
      if ( child1 instanceof THREE.Mesh ) {
        child1.castShadow = true;
        child1.receiveShadow = true;
      }
    } );
    //Specify the characteristics of the model
    avatar2.position.set(6.3,0,0.7);
    avatar2.rotation.set(0,0.4,0);
    avatar2.scale.set(0.02,0.02,0.02);
    //Add the model to the scene
    scene.add( avatar2 );
    //Log sting to the console
    console.log('Second Avatar successfully loaded.');
  } );
}
//Allow for scene resizing when window is adjusted
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Applying animation to the scene--------------
function animate() {
  //have the animations in the scene play on a loop
  renderer.setAnimationLoop( animate ) ;
  //commence the recording and displaying of the system performance statistics
  stats.begin();
  //calculate the change of the world clock to apply the animations at the correct rate
  const delta =  Math.min(clock.getDelta(), 0.1);
  world.step(delta);

  //have the animations run in line with the clock change
  if ( mixer ) mixer.update( delta );
  if ( mixer1 ) mixer1.update( delta );

  //Apply rotation to shader mesh
  mesh1.rotation.x += 0.005;
  mesh1.rotation.y += 0.01;
  mesh2.rotation.y += 0.05;

  //Setting the adjustment requirements to the physics 3D objects when they are in motion
  cubeMesh.position.set(cubeBody.position.x, cubeBody.position.y, cubeBody.position.z)
  cubeMesh.quaternion.set(
      cubeBody.quaternion.x,
      cubeBody.quaternion.y,
      cubeBody.quaternion.z,
      cubeBody.quaternion.w
  )
  //Setting the adjustment requirements to the physics 3D objects when they are in motion
  sphereMesh.position.set(sphereBody.position.x, sphereBody.position.y, sphereBody.position.z)
  sphereMesh.quaternion.set(
      sphereBody.quaternion.x,
      sphereBody.quaternion.y,
      sphereBody.quaternion.z,
      sphereBody.quaternion.w
  )
  //calliing u_time value for incorporation into the shader code
  uniforms.u_time.value += 0.05;
  //Render the scene and the camera
  renderer.render(scene, camera);
  stats.end();
}
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
//-------------Initialising the functions--------------

//calling the relevent functions for Initialisation and execution
function init() {
  createRenderer();
  createCamera();
  createScene();
  createLight();
  physicsBodies();
  loadModel();
  loadAvatar1();
  loadAvatar2();
  groundFloor();
  videoBoard();
  addSphere();
  shader1();
  shader2();
  shader3();
  createAmbientSound();
  createUtils();
  onWindowResize();
  animate();
}

init();
////////////////////////////////////////////////////////////////////////////////
