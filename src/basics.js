// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
let scene = new THREE.Scene();

// Create a basic perspective camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -2;
camera.position.y = -0.5;
camera.position.z = 8;

// Start controls
new THREE.OrbitControls(camera);

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

// Create a Cube Mesh with basic materials
let geometry = new THREE.BoxGeometry(1, 1, 1);
let materials = [
	new THREE.MeshBasicMaterial({
		color: 'red'
	}),
	new THREE.MeshBasicMaterial({
		color: 'green'
	}),
	new THREE.MeshBasicMaterial({
		color: 'blue'
	}),
	new THREE.MeshBasicMaterial({
		color: 'yellow'
	}),
	new THREE.MeshBasicMaterial({
		color: 'cyan'
	}),
	new THREE.MeshBasicMaterial({
		color: 'magenta'
	}),
];

let dest = new THREE.Vector3(2, 2, 2);

let cube = new THREE.Mesh(geometry, materials);
let cube2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({
	color: 'purple'
}));
cube2.position.copy(dest);
cube2.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2));

// Add coordinate system
scene.add(new THREE.AxesHelper(5));

// Objects setup
/*
scene ->
	parent ->
		cube
	cube2
*/
let parent = new THREE.Object3D();
parent.add(cube);
cube.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 3));

// Add cube to Scene
scene.add(parent);
scene.add(cube2);

// Render Loop
let frameCounter = 0;

// Mess with the cube
cube.position.y = 1.2;
// cube.rotation.x += Math.PI / 3;
parent.position.x = 1;
parent.rotation.x += Math.PI / 4;

parent.updateMatrixWorld(true);
cube.updateMatrixWorld(true);

// These 2 are equivalent
// dest.applyMatrix4(new THREE.Matrix4().getInverse(cube.matrixWorld));
cube.worldToLocal(dest);

let up = new THREE.Vector3(0, 1, 0);

let matrix = new THREE.Matrix4().lookAt(dest, new THREE.Vector3(), up);
let angles = new THREE.Euler().setFromRotationMatrix(matrix);
angles.z = 0;

let currentAngles = cube.rotation.clone();

let render = function () {
	setTimeout(() => {
		requestAnimationFrame(render);
	}, 1000 / 10);

	if (frameCounter >= 100) {
		frameCounter = 0;
	}

	if (Math.abs(angles.x) - Math.abs(currentAngles.x) > 0.0001) {
		currentAngles.x += angles.x / 20;
	}
	if (Math.abs(angles.y) - Math.abs(currentAngles.y) > 0.0001) {
		currentAngles.y += angles.y / 20;
	}

	cube.quaternion.setFromEuler(currentAngles);

	frameCounter += 1;

	// Render the scene
	renderer.render(scene, camera);
};

render();