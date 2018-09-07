// ------------------------------------------------
// BASIC SETUP
// ------------------------------------------------

// Create an empty scene
let scene = new THREE.Scene();

let stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

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

// Used to display debug info
let infoElement = document.getElementById('info');

// ------------------------------------------------
// FUN STARTS HERE
// ------------------------------------------------

let light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
light.position.set(0, 1, 0);
scene.add(light);

// Instantiate a loader
let loader = new THREE.GLTFLoader();
let parent = new THREE.Object3D();
let head = {};
let leftEye = {};
let rightEye = {};

let clock = new THREE.Clock();

loader.load(
	'models/head.gltf',
	(gltf) => {
		console.log(gltf);

		head = gltf.scene.children[0];
		leftEye = head.children[0];
		rightEye = head.children[1];

		scene.add(gltf.scene);

		run();
	}
);

function run() {
	let dest = new THREE.Vector3(2, 2, 2);

	// let head = new THREE.Mesh(geometry, materials);
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
	parent.add(head);
	leftEye.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 5));
	rightEye.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 5));

	// Add head to Scene
	scene.add(parent);
	scene.add(target);

	parent.updateMatrixWorld(true);
	head.updateMatrixWorld(true);

	// These 2 are equivalent
	// dest.applyMatrix4(new THREE.Matrix4().getInverse(head.matrixWorld));
	head.worldToLocal(dest);

	function onDocumentKeyDown(event) {
		if (event.key === 'A') {
			target.position.x -= 1;
			dest.x -= 1;
		} else if (event.key === 'D') {
			target.position.x += 1;
			dest.x += 1;
		} else if (event.key === 'W') {
			target.position.y += 1;
			dest.y += 1;
		} else if (event.key === 'S') {
			target.position.y -= 1;
			dest.y -= 1;
		} else if (event.key === 'Z') {
			target.position.z -= 1;
			dest.z -= 1;
		} else if (event.key === 'X') {
			target.position.z += 1;
			dest.z += 1;
		} else if (event.key === 'w') {
			// UP

		} else if (event.key === 'd') {
			// RIGHT

		} else if (event.key === 's') {
			// DOWN
		}
	}

	document.addEventListener('keydown', onDocumentKeyDown, false);

	function render() {
		stats.begin();

		let headPos = new THREE.Vector3();
		head.getWorldPosition(headPos);
		infoElement.innerHTML = 'Head: ' + JSON.stringify(headPos);
		let targetPos = new THREE.Vector3();
		target.getWorldPosition(targetPos);
		infoElement.innerHTML += '</br>Target: ' + JSON.stringify(targetPos)

		// Render the scene
		renderer.render(scene, camera);

		stats.end();

		requestAnimationFrame(render);
	}

	render();
}