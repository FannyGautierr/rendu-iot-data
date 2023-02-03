const socket = io('http://localhost:3000');
const canvas = document.querySelector('#render');
const scene = new THREE.Scene();

let mesh;

let targetXRotation = 0;
let targetYRotation = 0;
let targetZoom = 0;
let xRotation = 0;
let yRotation = 0;

let step = 0.1;

resizeCanvas();

let controllerId;

socket.on('hello', (arg) => {
  console.log(arg);
});

socket.on('control', (arg) => {
  controllerId ??= arg.controllerId;
  if (controllerId === arg.controllerId) {
    targetXRotation += arg.y / 800;
    targetYRotation += arg.x / 800;
    targetZoom = arg.zoom * 1.8;
  }
});

let loader = new THREE.TextureLoader();
loader.load('./resources/textures/earth_texture.jpg', function (texture) {
  let geometry = new THREE.SphereGeometry(1, 32, 16);

  let material = new THREE.MeshBasicMaterial({ map: texture, overdraw: 0.5 });
  mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  tick();
});

const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(canvas.width, canvas.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

function tick() {
  mesh.rotation.x += targetXRotation;
  mesh.rotation.y += targetYRotation;
  mesh.position.setZ(mesh.position.z + (targetZoom - mesh.position.z) * 0.01);
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
}

window.addEventListener('resize', () => {
  resizeCanvas();
  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();
  renderer.setSize(canvas.width, canvas.height);
});

function resizeCanvas() {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
}