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

let light = new THREE.HemisphereLight(0xbbbbff, 0x444422);
light.position.set(0, 1, 0);
scene.add(light);

// Instantiate a loader
let loader = new THREE.GLTFLoader();
let head = {};
let leftEye = {};
let rightEye = {};
let animations = {};
let mixer = {};
let clip = {};
let mixerRunning = false;
let clipWeight = 1.0;
let tweenDuration = 2000;

let clock = new THREE.Clock();

loader.load(
	'models/head.gltf',
	(gltf) => {
		console.log(gltf);

		head = gltf.scene.children[0];
		leftEye = head.children[0];
		rightEye = head.children[1];

		animations = gltf.animations;

		mixer = new THREE.AnimationMixer(head);

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
	let parent = new THREE.Object3D();
	parent.add(head);
	leftEye.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 5));
	rightEye.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 5));


	// Add head to Scene
	scene.add(parent);
	scene.add(target);

	// Render Loop
	let frameCounter = 0;

	parent.updateMatrixWorld(true);
	head.updateMatrixWorld(true);

	// These 2 are equivalent
	// dest.applyMatrix4(new THREE.Matrix4().getInverse(head.matrixWorld));
	head.worldToLocal(dest);

	let up = new THREE.Vector3(0, 1, 0);

	function onDocumentKeyDown(event) {
		if (event.key === 'A') {
			target.position.x += 1;
			dest.x += 1;
		} else if (event.key === 'D') {
			target.position.x -= 1;
			dest.x -= 1;
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
		} else if (event.key === 'p' || event.key === 'P') {
			if (!mixerRunning) {
				clip = mixer.clipAction(animations[0]);
				clip.play();
				mixerRunning = true;
			} else {
				clip.stop();
				mixerRunning = false;
			}
		} else if (event.key === '-' || event.key === '+') {
			let increment = event.key === '+' ? 0.2 : -0.2;
			clipWeight += increment;

			// clamp
			clipWeight = Math.max(0, clipWeight);
			clipWeight = Math.min(1, clipWeight);

			clip.weight = clipWeight;

			console.log('Clip weight: ', clipWeight);
		} else if (event.key === 'o' || event.key === '0') {
			animated = !animated;
		} else if (event.key === 'a') {
			// LEFT
			// parent.position.x -= 1;
			let tween = new TWEEN.Tween(parent.position)
				.to({
					x: parent.position.x - 1,
					y: parent.position.y,
					z: parent.position.z
				}, tweenDuration)
				.easing(TWEEN.Easing.Quadratic.Out)
				.onUpdate(() => {
					updateAngles(false);
				})
				.start();
		} else if (event.key === 'w') {
			// UP
			let tween = new TWEEN.Tween(parent.position)
			.to({
				x: parent.position.x,
				y: parent.position.y + 1,
				z: parent.position.z
			}, tweenDuration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				updateAngles(false);
			})
			.start();
		} else if (event.key === 'd') {
			// RIGHT
			let tween = new TWEEN.Tween(parent.position)
			.to({
				x: parent.position.x + 1,
				y: parent.position.y,
				z: parent.position.z
			}, tweenDuration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				updateAngles(false);
			})
			.start();
		} else if (event.key === 's') {
			// DOWN
			let tween = new TWEEN.Tween(parent.position)
			.to({
				x: parent.position.x,
				y: parent.position.y - 1,
				z: parent.position.z
			}, tweenDuration)
			.easing(TWEEN.Easing.Quadratic.Out)
			.onUpdate(() => {
				updateAngles(false);
			})
			.start();
		}
		updateAngles();
	}

	document.addEventListener('keydown', onDocumentKeyDown, false);

	let matrix = new THREE.Matrix4();
	let rotation = new THREE.Quaternion();
	let matrix2 = new THREE.Matrix4();
	let rotation2 = new THREE.Quaternion();

	let animating = false;
	let interpolationFactor = 0;

	function updateAngles(reset = true) {
		parent.updateMatrixWorld(true);
		// head.updateMatrixWorld(true);
		// leftEye.updateMatrixWorld(true);
		// rightEye.updateMatrixWorld(true);

		leftEyePos = new THREE.Vector3();
		leftEye.getWorldPosition(leftEyePos);
		rightEyePos = new THREE.Vector3();
		rightEye.getWorldPosition(rightEyePos);

		matrix = new THREE.Matrix4().lookAt(dest, leftEyePos, up);
		rotation = new THREE.Quaternion().setFromRotationMatrix(matrix);

		matrix2 = new THREE.Matrix4().lookAt(dest, rightEyePos, up);
		rotation2 = new THREE.Quaternion().setFromRotationMatrix(matrix2);

		if (reset) {
			interpolationFactor = 0;
			animating = true;
		}

		// console.log('Head: ', head.position);
		// console.log('L Eye: ', leftEye.position);
		// console.log('R Eye: ', rightEye.position);
	}


	let animated = true;
	let animatedRotation = rotation.clone();
	let animatedRotation2 = rotation2.clone();

	updateAngles();

	function render() {
		// Rotate head
		animatedRotation.slerp(rotation, interpolationFactor);
		animatedRotation2.slerp(rotation2, interpolationFactor);
		leftEye.quaternion.copy(animated ? animatedRotation : rotation);
		rightEye.quaternion.copy(animated ? animatedRotation2 : rotation2);

		frameCounter += 1;

		if (animating) {
			interpolationFactor += 1e-3;

			if (interpolationFactor >= 1) {
				animating = false;
				interpolationFactor = 0;

				// Restart
				if (mixerRunning) {
					animating = true;
					interpolationFactor = 0;
				}
			}

		}


		// Update animation
		if (mixerRunning) {
			mixer.update(clock.getDelta());

			// Re-compute rotation
			updateAngles(false);
		}

		// Update tween
		TWEEN.update();

		// Render the scene
		renderer.render(scene, camera);

		requestAnimationFrame(render);
	}

	render();
}