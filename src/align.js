var camera, scene, origin, parent, renderer, arm, target, finger, material, stats, controls;
var targetDir, armDir, targetRot;
var t = 0;

init();
animate();

function init() {
    // Renderer.
    renderer = new THREE.WebGLRenderer();
    //renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // Add renderer to page
    document.body.appendChild(renderer.domElement);

    // Create camera.
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 15;

    // Controls
    controls = new THREE.OrbitControls(camera);

    controls.maxPolarAngle = Math.PI / 2;


    // Create scene.
    scene = new THREE.Scene();

    scene.add(new THREE.AxesHelper(3));

    parent = new THREE.Object3D();
    // parent.rotation.y = Math.PI / 2;

    origin = new THREE.Object3D();
    // origin.rotation.x = Math.PI / 2;

    parent.add(origin);

    scene.add(parent);

    origin.add(new THREE.AxesHelper(1));

    // Create material
    material = new THREE.MeshPhongMaterial({ color: 0x00FF00, wireframe: true });

    // Create cube and add to scene.
    var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
    arm = new THREE.Mesh(geometry, material);
    arm.position.x += 1;
    arm.add(new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 0, 0), 5));
    arm.add(new THREE.AxesHelper(1));
    origin.add(arm);

    material = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: true });
    geometry = new THREE.BoxGeometry(1, 1, 1);

    target = createTarget(new THREE.Vector3(5, 7, 0));

    let dir = target.position.clone().sub(arm.position);
    let length = dir.length();
    dir = dir.normalize();

    origin.add(new THREE.ArrowHelper(dir, arm.position, length, 0xFF0000));

    targetDir = dir.clone();

    material = new THREE.MeshPhongMaterial({ color: 0x0000FF, wireframe: true });
    geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);

    const fingerPos = new THREE.Vector3(7, 2, -1);
    
    finger = new THREE.Mesh(geometry, material);
    finger.position.copy(fingerPos);

    dir = finger.position.clone().sub(arm.position.clone().add(new THREE.Vector3(5, 0, 0)));
    length = dir.length();
    dir = dir.normalize();

    arm.add(new THREE.ArrowHelper(dir, new THREE.Vector3(5, 0, 0), length, 0x0000FF));

    dir = finger.position.clone().sub(arm.position);
    length = dir.length();
    dir = dir.normalize();

    arm.add(new THREE.ArrowHelper(dir, new THREE.Vector3(), length, 0xA8800));

    armDir = dir.clone();

    arm.add(finger);

    updateTarget();

    // Create ambient light and add to scene.
    var light = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(light);

    // Create directional light and add to scene.
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Add listener for window resize.
    window.addEventListener('resize', onWindowResize, false);

    // Add stats to page.
    stats = new Stats();
    document.body.appendChild(stats.dom);

    document.body.onkeydown = rotate;
}

function computeRot(fromDir, toDir) {
    const rot = new THREE.Quaternion().setFromUnitVectors(fromDir, toDir);

    return rot;
}

function createTarget(position) {
    const domElement = renderer.domElement;
    const gizmo = new THREE.TransformControls(camera, domElement);

    const objTarget = new THREE.Object3D();
    gizmo.setSize(0.5);
    gizmo.attach(objTarget);
    gizmo.target = objTarget;
    objTarget.position.copy(position);

    gizmo.addEventListener('mouseDown', () => {
        controls.enabled = false;
    });
    gizmo.addEventListener('mouseUp', () => {
        controls.enabled = true;

        // Reset time
        t = 0;
    });

    gizmo.addEventListener('change', () => {
        updateTarget();
    });

    scene.add(gizmo);
    scene.add(objTarget);

    return objTarget;
}

function updateTarget() {
    let armPosition = arm.position;

    let dir = target.position.clone().sub(armPosition);
    let length = dir.length();
    dir = dir.normalize();

    origin.children[2] = new THREE.ArrowHelper(dir, arm.position, length, 0xFF0000);

    targetDir = dir.clone();
}

function setQuaternionFromDirection(direction, up, target) {
    const x = new THREE.Vector3();
    const y = new THREE.Vector3();
    const z = new THREE.Vector3();
    const m = new THREE.Matrix4();
    const el = m1.elements;

    z.copy(direction);
    x.crossVectors(up, z);

    if (x.lengthSq() === 0) {
        // parallel
        if (Math.abs(up.z) === 1) {
            z.x += 0.0001;
        } else {
            z.z += 0.0001;
        }
        z.normalize();
        x.crossVectors(up, z);
    }

    x.normalize();
    y.crossVectors(z, x);

    el[0] = x.x; el[4] = y.x; el[8] = z.x;
    el[1] = x.y; el[5] = y.y; el[9] = z.y;
    el[2] = x.z; el[6] = y.z; el[10] = z.z;

    target.setFromRotationMatrix(m);
}

function animate() {
    /*     targetRot = computeRot(armDir, targetDir);
        const worldRot = new THREE.Quaternion().setFromRotationMatrix(arm.parent.matrixWorld);
        targetRot.premultiply(worldRot.inverse());
        arm.quaternion.copy(targetRot); */
    //arm.children[0].quaternion.copy(targetRot);

    requestAnimationFrame(animate);

    renderer.render(scene, camera);
    stats.update();
}


function rotate() {
    worldRot = new THREE.Quaternion();
    arm.parent.getWorldQuaternion(worldRot);

    targetRot = computeRot(armDir, targetDir);

    targetRot.premultiply(worldRot.inverse());

    arm.quaternion.copy(targetRot);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}