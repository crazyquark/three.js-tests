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

let dest = new THREE.Vector3(2, 2, 2);

let cube = new THREE.Mesh(geometry, materials);
let cube2 = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
	color: 'purple'
}));
cube2.position.copy(dest);
cube2.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2));

// cube.position.x = 2;
// cube.position.y = 2;
// cube.position.z = 2;

// Add coordinate system
scene.add(new THREE.AxesHelper(5));

let parent = new THREE.Object3D();
parent.add(cube);

cube.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2));

// Add cube to Scene
scene.add(parent);

scene.add(cube2);

// Render Loop
let frameCounter = 0;

dest = cube.worldToLocal(dest);

// parent.position.x = 3;

// cube.lookAt(dest);
cube.lookAt(dest);

let render = function () {
	setTimeout(() => {
		requestAnimationFrame(render);
	}, 1000 / 30);

	// cube.rotation.x += 0.01;
	// cube.rotation.y += 0.01;
	// cube.rotation.z += 0.01;

	if (frameCounter < 20) {
		if (frameCounter % 2 == 0) {

		}

		frameCounter += 1;
	}

	// Render the scene
	renderer.render(scene, camera);
};

render();