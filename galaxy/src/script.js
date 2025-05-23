import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


const parameters = {}
parameters.count = 1000
parameters.size = 0.02
parameters.radius = 4
parameters.branches = 3
parameters.spin = 1
parameters.randomness = 0.2
parameters.randomnessPower = 3
parameters.insideColor = '#ffffff' 
parameters.outsideColor = '#1b3984'

let geom = null
let material = null
let points = null

const generateGalaxy = () => {


    if(points!=null)
    {
        geom.dispose()
        material.dispose()
        scene.remove(points)
    }

    geom = new THREE.BufferGeometry()
    
    const positions = new Float32Array(parameters.count*3)
    const colors = new Float32Array(parameters.count*3)

    const colorsInside = new THREE.Color(parameters.insideColor)
    const colorsOutsde = new THREE.Color(parameters.outsideColor)

    for(let i=0;i<parameters.count;++i)
    {
        const i3 = i*3
        
        const radius = Math.random()*parameters.radius
        const spinAngle = radius*parameters.spin
        const brachAngle = (i%parameters.branches)/parameters.branches*Math.PI*2

        const randomX = Math.pow(Math.random(), parameters.randomnessPower)*(Math.random()<0.5?1:-1)
        const randomY = Math.pow(Math.random(), parameters.randomnessPower)*(Math.random()<0.5?1:-1)
        const randomZ = Math.pow(Math.random(), parameters.randomnessPower)*(Math.random()<0.5?1:-1)

        positions[i3+0] = Math.cos(brachAngle+spinAngle)*radius + randomX
        positions[i3+1] = randomY
        positions[i3+2] = Math.sin(brachAngle+spinAngle)*radius + randomZ



        const mixedColor = colorsInside.clone()
        mixedColor.lerp(colorsOutsde,radius/parameters.radius)
        colors[i3+0] = mixedColor.r
        colors[i3+1] = mixedColor.g
        colors[i3+2] = mixedColor.b
    }


    geom.setAttribute('position', new THREE.BufferAttribute(positions,3))
    geom.setAttribute('color', new THREE.BufferAttribute(colors,3))

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation : true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors : true
    })

    points = new THREE.Points(geom, material)
    scene.add(points)
}

generateGalaxy()




gui.add(parameters, 'count').min(10).max(2000).step(100).onFinishChange(generateGalaxy).name('stars count')
gui.add(parameters,'size').min(0.01).max(0.1).step(0.01).onFinishChange(generateGalaxy).name('star size')
gui.add(parameters,'radius').min(0.02).max(10).step(0.1).onFinishChange(generateGalaxy).name('radius')
gui.add(parameters,'branches').min(2).max(8).step(1).onFinishChange(generateGalaxy).name('branches')
gui.add(parameters,'spin').min(-5).max(5).step(1).onFinishChange(generateGalaxy).name('spin')
gui.add(parameters,'randomness').min(0).max(2).step(0.01).onFinishChange(generateGalaxy).name('randomness')
gui.add(parameters,'randomnessPower').min(1).max(10).step(0.01).onFinishChange(generateGalaxy).name('randomnessPower')
gui.add(parameters,'insideColor').onFinishChange(generateGalaxy).name('insideColor')
gui.add(parameters,'outsideColor').onFinishChange(generateGalaxy).name('outsideColor')

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
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()



    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()