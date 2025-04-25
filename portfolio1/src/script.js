import * as THREE from 'three'
import * as dat from 'lil-gui'
import gsap from 'gsap'


const textureLoader = new THREE.TextureLoader()
const gradientTex = textureLoader.load('./textures/gradients/3.jpg')
gradientTex.magFilter = THREE.NearestFilter

/**
 * Debug
 */
const gui = new dat.GUI()

const parameters = {
    materialColor: '#ffeded'
}

gui
    .addColor(parameters, 'materialColor')
    .onChange(()=>
    {
        material.color.set(parameters.materialColor)
        particlesMaterial.color.set(parameters.materialColor)
    })

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Test cube
 */
const objectsDistance = 4

const material = new THREE.MeshToonMaterial({
    color:parameters.materialColor,
    gradientMap: gradientTex
})

const mesh1 = new THREE.Mesh(
    new THREE.TorusGeometry(1,0.4,16,60),
    material
)

const mesh2 = new THREE.Mesh(
    new THREE.ConeGeometry(1,2,32),
    material
)

const mesh3 = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.8,0.35,100,16),
    material
)

scene.add(mesh1,mesh2, mesh3)
const sectionMeshes = [mesh1,mesh2,mesh3]


mesh1.position.x = 2
mesh2.position.x = -2
mesh3.position.x = 2

mesh1.position.y = -objectsDistance*0
mesh2.position.y = -objectsDistance*1
mesh3.position.y = -objectsDistance*2


const particlesCount = 500
const positions = new Float32Array(particlesCount*3)
for(let i=0;i<particlesCount;++i)
{
    positions[i*3+0] = (Math.random()-0.5)*10
    positions[i*3+1] = objectsDistance*0.5 - Math.random()*objectsDistance*sectionMeshes.length
    positions[i*3+2] = (Math.random()-0.5)*10
}
const particleGeomm = new THREE.BufferGeometry()
particleGeomm.setAttribute('position', new THREE.BufferAttribute(positions,3))

const particlesMaterial = new THREE.PointsMaterial({
    color: parameters.materialColor,
    sizeAttenuation : true,
    size: 0.02
})

const particles = new THREE.Points(particleGeomm,particlesMaterial)
scene.add(particles)


const light = new THREE.DirectionalLight('#ffffff',1)
light.position.set(1,1,0)
scene.add(light)



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

const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
let scrollY = window.scrollY
let currentSection = 0 
window.addEventListener('scroll',()=>
{
    scrollY = window.scrollY
    const newSection = Math.round(scrollY/sizes.height) 
    if(newSection!=currentSection)
    {
        currentSection = newSection
        gsap.to(
            sectionMeshes[currentSection].rotation,
            {
                duration:1.5,
                ease: 'power2.intOut',
                x:'+=5',
                y:'+=2',
                z:'+=0.5'
            }
        )
    }
})

const cursor = {}
cursor.x = 0
cursor.y = 0
window.addEventListener('pointermove', (event)=>{
    cursor.x = event.clientX/sizes.width-0.5
    cursor.y = event.clientY/sizes.height-0.5

})


const clock = new THREE.Clock()
let prev_time = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    const delta_time = elapsedTime-prev_time
    prev_time = elapsedTime

    camera.position.y = -(scrollY/sizes.height)*objectsDistance

    const parallaxX = cursor.x
    const parallaxY = -cursor.y

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x)*0.8*delta_time
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y)*0.8*delta_time

    for(const mesh of sectionMeshes)
    {
        mesh.rotation.x += delta_time*0.5
        mesh.rotation.y += delta_time*0.5
        //mesh.rotation.z = elapsedTime*0.1
    }

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()