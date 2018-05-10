// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
let scene = new THREE.Scene();

// Create a basic perspective camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

// Create a renderer with Antialiasing
let renderer = new THREE.WebGLRenderer({
	antialias: true
});

// Configure renderer clear color
renderer.setClearColor("#000000");

// Configure renderer size
renderer.setSize(window.innerWidth, window.innerHeight);

// Append Renderer to DOM
document.body.appendChild(renderer.domElement);

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

// Create a Cube Mesh with basic material
let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshBasicMaterial({
	color: 'green'
});
let cube = new THREE.Mesh(geometry, material);

// Add cube to Scene
scene.add(cube);

// Render Loop
let render = function () {
	requestAnimationFrame(render);

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	// cube.rotation.z += 0.01;

	let dest = new THREE.Vector3(1, 1, 1);
	let rotMatrix = new THREE.Matrix4().lookAt(dest, new THREE.Vector3(0, 1, 0));


	cube.rotateX(0.01);

	// Render the scene
	renderer.render(scene, camera);
};

render();