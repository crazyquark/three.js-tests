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

// Create a head Mesh with basic materials
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

let head = new THREE.Mesh(geometry, materials);
let target = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({
	color: 'purple'
}));
target.position.copy(dest);
target.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2));

// Add coordinate system
scene.add(new THREE.AxesHelper(5));

// Objects setup
/*
scene ->
	parent ->
		head
	target
*/
let parent = new THREE.Object3D();
parent.add(head);
head.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 3));

// Add head to Scene
scene.add(parent);
scene.add(target);

// Render Loop
let frameCounter = 0;

// Mess with the head
head.position.y = 1.2;
// head.rotation.x += Math.PI / 3;
parent.position.x = 1;
// parent.rotation.x += Math.PI / 4;

parent.updateMatrixWorld(true);
head.updateMatrixWorld(true);

// These 2 are equivalent
// dest.applyMatrix4(new THREE.Matrix4().getInverse(head.matrixWorld));
head.worldToLocal(dest);

let up = new THREE.Vector3(0, 1, 0);

function onDocumentKeyDown(event) {
	if (event.key === 'a') {
		target.position.x += 1;
		dest.x += 1;
	} else if (event.key === 'd') {
		target.position.x -= 1;
		dest.x -= 1;
	} else if (event.key === 'w') {
		target.position.y += 1;
		dest.y += 1;
	} else if (event.key === 's') {
		target.position.y -= 1;
		dest.y -= 1;
	}

	updateAngles();
}

document.addEventListener('keydown', onDocumentKeyDown, false);

let matrix = new THREE.Matrix4();
let rotation = new THREE.Euler();

let animating = false;
let interpolationFactor = 0;

function updateAngles() {
	matrix = new THREE.Matrix4().lookAt(dest, new THREE.Vector3(), up);
	rotation = new THREE.Quaternion().setFromRotationMatrix(matrix);

	interpolationFactor = 0;
	animating = true;
}

updateAngles();

let animated = true;

let animatedRotation = rotation.clone();

function render() {
	animatedRotation.slerp(rotation, interpolationFactor);

	head.quaternion.copy(animated ? animatedRotation : rotation);

	frameCounter += 1;

	if (animating) {
		interpolationFactor += 1e-3;

		if (interpolationFactor >= 1) {
			animating = false;
			interpolationFactor = 0;
		}
	}
	
	// Render the scene
	renderer.render(scene, camera);

	requestAnimationFrame(render);
}

render();