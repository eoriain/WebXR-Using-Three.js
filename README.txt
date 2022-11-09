Name: Eoghan Ó Riain
Student Number: 111319036
Module: CS6105 - Future and Emerging Interaction Technologies
Assignment: WebXR using Three.js

Project Setup:

I started this project by first setting up the project folder (Titled "ORiain_Eoghan_111319036_CS6105"). Within this folder I created two subfolders, Assets and Libs. The Assets folders contains the models, textures and HDRI that will be applied to the scene. The Libs folder contains the relevant libraries for reference with the Javascript code to call their functions. With these folders created, next a .js and a .html file was added to the project folder. Both with the title Assignment_2. The html file sets up the webpage on which the content will be displayed. Within this file, the javascript file is called to apply its content to the webpage. The html file also hosts the fragment and vertex shader code (refer to "Shaders" section below) as well as the source for the video content to be applied to the scene.

Import the Libraries:

The first step in creating the threejs content is to import the necessary libraries to enable the content's functionality. The libraries called within this project were sourced for the Threejs Github page. Below are the libraries used and the reason for their application:
three.module  -  Apply threejs commands and functionality.
OrbitalControl  -  Allowing user interactive orbital control of the scene.
GUI  -  Creating a Graphical User Interface for the user to interact with the content of the scene.
VRButton  -  To enable WebXR and allow the user to experience the scene in virtual reality.
ColladaLoader  -  To load .dae models
FBXLoader  -  To load .fbx model
Cannon-es  -  To load third party physics library
RGBELoader  -  To allow for texturing and HDRI application
Stats  -  To present the user with fps, ms and mb information on screen.


Lights, Camera, Action:

There are three key components to a functional 3D scene: A light source, a camera to represent the user's perspective, and the scene itself. 

Within this project there are three different light sources - Ambient light, directional light and spot light. 

Ambient light was used to cast uniform light throughout the scene one of its features is that it will not cast a shadow as its light rays are not directional, but uniform. The only parameters required to defined the ambient light is its colour and the intensity of the light, before adding it to the scene.

Directional lighting has a source point and casts light in a singular uniform direction. The benefit of this form of lighting is that it has the same effect on the scene as the sun does. The reason being that due to the sun's distance for the earth, its rays strike the in essentially a parallel fashion. Therefore, there are a number of arguments and settings required to finalise this form of lighting as a light source. Firstly, the colour and intensity of the light is specified, similarly to the ambient lighting. Next, the target of the directional lighting is specified. Then, in order to ensure satisfactory shadowing is achieved, the castShadow property of the lighting is set to true and the lighting source is defined which will orientate the shadow casting. Further details are provided to the shadow property of the directional lighting improve the final scene results. Then the directional light is added to the scene.

Spot lighting operates similarly to the directional light and therefore requires many of the same parameters as previously specified. The purpose of a spotlight is to replicate the effect a light source being positioned relatively close to the target. Its rays are cast in a non-uniform direction.

The Environment:

Rather than ticking off the requirements for this project, I wished to develop a theme and a story to give the scene context. The theme I wished to present was Sci-fi/Space. To do this, I applied a space HDRI to the scene using the RGBELoader and adding the .hdr file as a texture to the background and environment property of the scene. 

This theme influenced the model and audio selection and the stage on which the scene would be set. Refer to the "Import External Models/Library" and "Audio" sections below for further detail on these topics.


Audio:

There are two types of audio included within this scene; Ambient sound and spatial sound.

Ambient audio is a form of audio delivery in which the audio content is heard at a uniform level through out the scene and from no discernible direction. The ambient audio selected was a "space travel" style piece of audio to compliment the theme of the scene. To ensure it continuously plays and at an acceptable volume level to the user, the setVolume property of the audio was set to 0.25 and the setLoop property was set to true.

Spatial audio is a form of audio that has a source. Its perception by the user is dependent on the users proximity and orientation relative to the source of the audio (i.e if the user is far away from the source the audio would be faint, and if the source is to the right of the user then the audio will be heard in the user's right ear). To implement this, I defined a THREE.PosionalAudio to which I loaded the audio of a spaceship. I then connected this audio to the model of a spaceship in the scene. To ensure it continuously plays and at an acceptable volume level to the user, the setVolume property of the audio was set to 0.25 and the setLoop property was set to true.

Create Planes:

There are three planes incorporated into the scene; the screen frame, the screen, and the ground floor. 

The screen frame was added using PlaneGeometry and setting its dimensions, colour, orientation and position. The same was done for the screen itself, with its dimensions slightly reduced to be centred in the frame. The video element identified in the html code was then called using the "getElementById" command. This video was then applied as a texture to the plane and instructed to play the video content on a loop. Finally, I added a ground floor plane upon which the characters will be animated. I scaled the plane to occupy the area of the scene, then I wrapped cobblestone texturing to the plane to provide an added sense of realism.

Import External Models:

Within the scene there are a total of six models included; The UCC Quad, the asteroid, the spaceship, the sofa and the two characters. Each model is given a position, orientation and scale as well as applying the parameter to cast and receive shadows. To load each of the models, its relative loader is required (ColladaLoader for .dae files and FBXLoader for .fbx files). All models are motionless with the characters. The two characters have been independently animated from an external source (refer to citation section). In order to apply the animation in threejs an AnimationMixer was applied to the character parameter to have the animation play in line with the delta of the clock. These characters were generated with image textures applied and were subsequently carried over during the import.


External Physics Library:

In order to incorporate some basic physics to the scene, the third-party library Cannon-es was imported. To demonstrate the presence of physics, a function was written in which both a sphere and a cude was added to the ground plane. A mass was applied to each of these objects, a transparent plane was applied at ground level and gravitational constraints were applied to the scene with the world. These features were made possible using the cannon library. An initial gravitational value of -9.81 m/s was applied to the z-axis and a value of 0 m/s on the x and y-axis to replicate the gravitational value on earth. However, this scene is situated in space. Therefore, the option to adjust these values is given to the user in the GUI to create a higher level of user experience and also to demonstrate the physics of the objects when various forces are applied.

Shaders:

In the scene there are three different vertex-fragment shader pairs applied to five different 3D objects. Each of the vertex and fragment shaders are defined in the code in the .html file and called through to the javascript file within their individual shader functions. To apply the shader to the 3D object, the uniform, fragmentShader and vertexShader must first be applied to the objects ShaderMaterial which subsequently is added to its mesh as a parameter, as well as the objects geometry

GUI:

A requirement for this project was to provide a suitable GUI to allow the user to both monitor the system performance as well as allowing the user to control aspects of the scene with widgets. 

To allow the user to control aspects of the scene, the GUI functionality of the DAT.GUI library was imported. Then, I created a "createUtils" function to apply the GUI to the scene. Within the GUI, functionality has been applied to allow the user to switch on or off the ambient or positional audio, as well as mute both. As previously mention in the "External Physics Library", in the GUI the user can also control the x, y and z gravity values to manipulate physical 3D objects in the scene.

Next, to allow the user to monitor the system performance the stats.module was imported. A statistics panel was then added to the screen to allow the user to monitor the fps, ms and mb of the screen. The user can cycle through these statistics by clicking on the panel.

Apply WebXR:

In order to add WebXR functionality, the VRButton library was imported. Then within the renderer a button was created to called the VRButton/WebXR functionality when clicked.

Star field:

In order to add depth to the space HDRI, I choose to add a star field throughout the scene. This was done by defining a sphere to represent a distant star and then randomly positioning the spheres throughout the scene.

Other Notes:

Functionality has been added to delivery console messages upon successful loading of an element of the scene. This assisted in the debugging processes.

Also, dependant on the display device used, the scene will take 30-60s before becoming fully operational due to model and HDRI size.

Citations:

This project was completed using external sources, below is acknowledgement to each of these elements:

Avatar 1 Model & Animation - https://www.mixamo.com/#/

Avatar 2 Model & Animation - https://www.mixamo.com/#/

Asteroid Model -https://www.turbosquid.com/3d-models/asteroid-2012-da14-max-free/724453#

UCC Quad Model - https://3dwarehouse.sketchup.com/model/6462d7654febede2b26f9a938223dcc5/The-Main-Quad-University-College-Cork?hl=en

Sofa Model - https://polyhaven.com/models

UFO Model - https://www.turbosquid.com/3d-models/ufo-3d-model-1759467

Cobblestone Texture Pack - https://www.poliigon.com/search/CobblestoneArches002

Shader 3 - https://www.shadertoy.com/view/MdBfzR    and    https://codepen.io/grum/pen/PoJMOoZ?editors=0110

Space HDRI - Created by Username-Shadowstorm and shared here https://blenderartists.org/t/space-hdri/649981/6

Positional Audio File - https://www.soundboard.com/sb/sound/963781

Ambient Audio File - https://pixabay.com/music/ambient-traveling-through-space-3281/

Physics Library - https://github.com/pmndrs/cannon-es
