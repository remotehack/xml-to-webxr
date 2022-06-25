import * as THREE from 'https://unpkg.com/three@0.141.0/build/three.module.js';

import { ARButton } from 'https://unpkg.com/three@0.141.0/examples/jsm/webxr/ARButton.js'

console.log("EMBEDDED SCRIPT!", ARButton)





const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
camera.position.z = 1.5;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearAlpha(0)

// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(700, 700);
// renderer.setAnimationLoop(animation);

document.querySelector('#output').appendChild(renderer.domElement);






const spheres = []

for (const item of document.querySelectorAll('.item')) {
    const title = item.querySelector("h2").innerText;
    const description = item.querySelector("p").innerText;
    const link = item.querySelector("a").getAttribute("href");
    const durationString = item
        .querySelector("a")
        .querySelector("span").innerText;
    
    const durationMatcher = durationString.match(/(\d+):(\d+):(\d+)/)
    let durationSeconds = 0

    if (durationMatcher) {
        durationSeconds = parseInt(durationMatcher[1]) * 60 * 60
        durationSeconds += parseInt(durationMatcher[2]) * 60
        durationSeconds += parseInt(durationMatcher[3])
    }

    const color =  0xffffff * Math.random()

    const material = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
    });

    // https://threejs.org/docs/?q=sphe#api/en/geometries/SphereGeometry
    const sphereRadius = 0.001 * durationSeconds
    const sphereGeom = new THREE.SphereGeometry(sphereRadius, 6, 6);
    const sphere = new THREE.Mesh(sphereGeom, material);

    sphere.position.x = Math.random() - 0.5;
    sphere.position.y = Math.random() - 0.5;
    sphere.position.z = Math.random() - 0.5;

    sphere.rotation.x = Math.random();
    sphere.rotation.y = Math.random();

    scene.add(sphere);
    spheres.push(sphere);

    sphere.userData = {
        play() {
            console.log("OVER");
            console.log("Start playing", link);
            const audio = new Audio(link)
            audio.play()
        },
        color
    };
}


let hover;
const playing = new Set();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(.5, .5);

function onPointerMove(event) {
    pointer.x = (event.offsetX / 700) * 2 - 1;
    pointer.y = - (event.offsetY / 700) * 2 + 1;
}

function point() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    hover = null
    for (const intersect of intersects) {
        const sphere = intersect.object;
        sphere.material.color.set(0xff0000);

        hover = sphere

    }


}

renderer.domElement.addEventListener("mousemove", onPointerMove)

renderer.domElement.addEventListener("mousedown", () => {
    console.log("DOWN")
    const sphere = hover;
    if (!playing.has(sphere)) {
            console.log("...", sphere)

            playing.add(sphere)

            sphere.userData?.play?.()
        }
})





function animation(time) {
    point()

    spheres.forEach((sphere, i) => {
        sphere.rotation.x = (time / 5000) + i;
        sphere.rotation.y = (time / 10000) + i;
    })

    renderer.render(scene, camera);

}

renderer.xr.enabled = true;
document.body.appendChild( ARButton.createButton( renderer ) )

renderer.setAnimationLoop(animation);