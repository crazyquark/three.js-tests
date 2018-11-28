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
let animations = {};
let mixer = {};
let clipAction = {};
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
		clipAction = mixer.clipAction(animations[0]);

		scene.add(gltf.scene);

		run();
	}
);

function run() {
	let dest = new THREE.Vector3(2, 2, 2);

	// let head = new THREE.Mesh(geometry, materials);
	// let target = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.2), new THREE.MeshBasicMaterial({
	// 	color: 'purple'
	// }));
	// target.position.copy(dest);
	// target.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 2));

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
    head.add(new THREE.ArrowHelper(new THREE.Vector3(0,0,1), new THREE.Vector3(), 5, 0xff00000))
	leftEye.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 5));
	rightEye.add(new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 5));


	// Add head to Scene
	scene.add(parent);
	// scene.add(target);

	// Render Loop
	let frameCounter = 0;

	parent.updateMatrixWorld(true);
	head.updateMatrixWorld(true);

	// These 2 are equivalent
	// dest.applyMatrix4(new THREE.Matrix4().getInverse(head.matrixWorld));
	head.worldToLocal(dest);

	let up = new THREE.Vector3(0, 1, 0);

	let animCounter = 0;

	function createAnimClip(target) {
		let duration = animations[0].duration;
		let noSamples = animations[0].tracks[0].times.length;

		let values = [];
		for (let i = 0; i < noSamples; i++) {
			values[i * 3] = target.x || 0;
			values[i * 3 + 1] = target.y || 0;
			values[i * 3 + 2] = target.z || 0;
		}

		let positionKF = new THREE.VectorKeyframeTrack('.position', [...Array(noSamples).keys()], values);

		let dummyClip = new THREE.AnimationClip('Anim', duration, [positionKF]);

		return dummyClip;
	}

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
		} else if (event.key === 'p' || event.key === 'P') {
			if (!mixerRunning) {
				clipAction.play();
				mixerRunning = true;
			} else {
				if (clipAction.stop !== undefined) clipAction.stop();
				mixerRunning = false;
			}
		} else if (event.key === '-' || event.key === '+') {
			let increment = event.key === '+' ? 0.2 : -0.2;
			clipWeight += increment;

			// clamp
			clipWeight = Math.max(0, clipWeight);
			clipWeight = Math.min(1, clipWeight);

			clipAction.setEffectiveWeight(clipWeight);
			clipAction.setEffectiveTimeScale(1);

			console.log('Clip weight: ', clipWeight);
		} else if (event.key === 'o' || event.key === '0') {
			animated = !animated;
		} else if (event.key === 'a') {
			// LEFT
			// Warning: read position BEFORE stoping clip
			let endPos = new THREE.Vector3();
			head.getWorldPosition(endPos);
			endPos.x -= 1;
			
			if (head.posAction !== undefined) {
				head.posAction.stop();
				mixer.uncacheClip(head.posAction._clip);
			}

			let newClip = createAnimClip(endPos);

			head.posAction = mixer.clipAction(newClip, head).play();
			head.posAction.setEffectiveWeight(1 - clipWeight);
			head.posAction.setEffectiveTimeScale(1);

			mixerRunning = true;
		} else if (event.key === 'w') {
			// UP
			// if (parent.tween !== undefined && parent.tween.isPlaying()) {
			// 	return;
			// }

			// parent.tween = new TWEEN.Tween(parent.position)
			// .to({
			// 	x: parent.position.x,
			// 	y: parent.position.y + 1,
			// 	z: parent.position.z
			// }, tweenDuration)
			// .easing(TWEEN.Easing.Quadratic.Out)
			// .onUpdate(() => {
			// 	updateAngles(false);
			// })
			// .start();
		} else if (event.key === 'd') {
			// RIGHT
			// if (parent.tween !== undefined && parent.tween.isPlaying()) {
			// 	return;
			// }

			// parent.tween = new TWEEN.Tween(parent.position)
			// .to({
			// 	x: parent.position.x + 1,
			// 	y: parent.position.y,
			// 	z: parent.position.z
			// }, tweenDuration)
			// .easing(TWEEN.Easing.Quadratic.Out)
			// .onUpdate(() => {
			// 	updateAngles(false);
			// })
			// .start();
		} else if (event.key === 's') {
			// DOWN
			// 	if (parent.tween !== undefined && parent.tween.isPlaying()) {
			// 		return;
			// 	}

			// 	parent.tween = new TWEEN.Tween(parent.position)
			// 	.to({
			// 		x: parent.position.x,
			// 		y: parent.position.y - 1,
			// 		z: parent.position.z
			// 	}, tweenDuration)
			// 	.easing(TWEEN.Easing.Quadratic.Out)
			// 	.onUpdate(() => {
			// 		updateAngles(false);
			// 	})
			// 	.start();
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
		stats.begin();

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

		let headPos = new THREE.Vector3();
		head.getWorldPosition(headPos);
		infoElement.innerHTML = 'Head: ' + JSON.stringify(headPos);
		// let targetPos = new THREE.Vector3();
		// target.getWorldPosition(targetPos);
		// infoElement.innerHTML += '</br>Target: ' + JSON.stringify(targetPos)

		// Update tween
		TWEEN.update();

		// Render the scene
		renderer.render(scene, camera);

		stats.end();

		requestAnimationFrame(render);
	}

	render();
}

function rotateHead(angles) {
    angles.pan = Math.PI * angles.pan / 180 ;
    angles.tilt = Math.PI * angles.tilt / 180;

    let rotation = new THREE.Quaternion();
    let panQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0), angles.pan);
    let tiltQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0), angles.tilt);

    rotation.multiply(panQuat);
    rotation.multiply(tiltQuat);

    head.quaternion.copy(rotation);
}