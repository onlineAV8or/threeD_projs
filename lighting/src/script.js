import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const axisHelper = new THREE.AxesHelper()
scene.add(axisHelper)
/**
 * Debug
 */
const gui = new dat.GUI();



const textureLoader = new THREE.TextureLoader()
const doorColorTexture = textureLoader.load('/textures/door/color.jpg')

const material = new THREE.MeshStandardMaterial()
//material.map=doorColorTexture
material.side = THREE.DoubleSide
material.roughness = 0.3
material.metalness = 0.5

const sphereGeometry = new THREE.SphereGeometry(1,16,16)
const sphere = new THREE.Mesh(sphereGeometry,material)
sphere.position.x =-1.5
sphere.castShadow = true

const donutDeometry = new THREE.TorusGeometry(0.7,0.3,12,30)
const donut=new THREE.Mesh(donutDeometry,material)
donut.position.x = 1.5
donut.castShadow = true

const planeGeometry = new THREE.PlaneGeometry(10,10)
const plane = new THREE.Mesh(planeGeometry,material)
plane.rotation.x = -1.6
plane.position.y = -1.5
plane.receiveShadow = true

scene.add(sphere, plane, donut)



/**
 * Light
 */

const ambientLight = new THREE.AmbientLight(0xffffff,1.0)
scene.add(ambientLight)
gui.add(ambientLight,'intensity').min(0).max(1).step(0.001).name('Amb light intensity')

const directionalLight =  new THREE.DirectionalLight(0x00fffc,0.3)
directionalLight.position.set(2,2,-1)
directionalLight.castShadow  = true
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
directionalLight.shadow.camera.near = 0
directionalLight.shadow.camera.far = 8
scene.add(directionalLight)
gui.add(directionalLight,'intensity').min(0).max(1).step(0.001).name('Dir Light intensity')

const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.5)
scene.add(dirLightHelper)
const dirLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
scene.add(dirLightCameraHelper)

const pointLight = new THREE.PointLight(0xff9000,0.5,1,2)
pointLight.position.set(1,-0.5,1)
scene.add(pointLight)
gui.add(pointLight,'distance').min(1).max(10).step(0.001).name('point light dist')

const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.5)
scene.add(pointLightHelper)

const spotlight = new THREE.SpotLight(0x78ff00,0.5,10,Math.PI*0.1,0.25,1)
spotlight.castShadow  = true
spotlight.shadow.camera.near = 1
spotlight.shadow.camera.far = 8
spotlight.position.set(-2,2,2)
gui.add(spotlight,'intensity').min(0).max(1).step(0.001).name('spot light dist')
gui.add(spotlight.position,'x').min(-10).max(10).step(0.001).name('spot light x')
gui.add(spotlight.position,'y').min(-10).max(10).step(0.001).name('spot light y')
gui.add(spotlight.position,'z').min(-10).max(10).step(0.001).name('spot light z')
scene.add(spotlight)

const SpotLightHelper = new THREE.SpotLightHelper(spotlight)
//SpotLightHelper.visible = false
scene.add(SpotLightHelper)
const spotLightCamHelper = new THREE.CameraHelper(spotlight.shadow.camera)
//spotLightCamHelper.visible = false
scene.add(spotLightCamHelper)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 500)
camera.position.set(0, 0, 15);

scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    donut.rotation.y = Math.PI*0.1 + elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()