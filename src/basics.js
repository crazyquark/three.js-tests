// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
let scene = new THREE.Scene();

// Create a basic perspective camera
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 4;

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

let cube = new THREE.Mesh(geometry, materials);
// cube.position.x = 2;
// cube.position.y = 2;
// cube.position.z = 2;

// Add coordinate system
scene.add(new THREE.AxesHelper(5));

// Add cube to Scene
scene.add(cube);

// Render Loop
let frameCounter = 0;

cube.rotation.x = Math.PI / 4;
cube.rotation.y = Math.PI / 4;
cube.rotation.z = Math.PI / 4;

let dest = new THREE.Vector3(1, 1, 1);
dest = cube.worldToLocal(dest);

let up = new THREE.Vector3(0, 1, 0);
up.applyQuaternion(cube.quaternion);

let rotMatrix = new THREE.Matrix4().lookAt(dest, new THREE.Vector3(), up);
let angles = new THREE.Euler().setFromRotationMatrix(rotMatrix);

console.log(angles);

let render = function () {
	setTimeout(() => {
		requestAnimationFrame(render);
	}, 1000 / 30);

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	// cube.rotation.z += 0.01;

	if (frameCounter < 20) {
		if (frameCounter % 2 == 0) {
			cube.rotateX(angles.x / 10);
			cube.rotateY(angles.y / 10);
			cube.rotateZ(angles.z / 10);
		}

		frameCounter += 1;
	}

	// Render the scene
	renderer.render(scene, camera);
};

render();