import * as THREE from 'https://unpkg.com/three@0.141.0/build/three.module.js';

import { ARButton } from 'https://unpkg.com/three@0.141.0/examples/jsm/webxr/ARButton.js'

import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js'



const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
camera.position.z = 1.5;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearAlpha(0)

renderer.setSize(700, 700);

document.querySelector('#output').appendChild(renderer.domElement);


const controls = new OrbitControls( camera, renderer.domElement )




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

    sphere.position.x = (Math.random() - 0.5) * 2;
    sphere.position.y = (Math.random() - 0.5) * 2;
    sphere.position.z = (Math.random() - 0.5) * 2;

    sphere.rotation.x = Math.random();
    sphere.rotation.y = Math.random();

    scene.add(sphere);
    spheres.push(sphere);

    sphere.userData = {
        link,
        color
    };
}



let hover;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0,0);

let playing;

function point() {
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    let max = 10000;
    let nearest;
    for (const {object, distance} of intersects) {
        if(distance < max) {
            max = distance
            nearest = object;
        }
    }
    if(nearest) {
        if(hover !== nearest) {
            
            if(nearest.userData.link) {
                if(playing) playing.pause()

                console.log("PLAY", nearest.userData.link)

                const audio = new Audio(nearest.userData.link)
                audio.play()
                playing= audio;
            }
            

            hover = nearest
        }

    }
    
}



function animation(time) {
    
    controls.update();

    point()

    spheres.forEach((sphere, i) => {
        sphere.rotation.x = (time / 5000) + i;
        sphere.rotation.y = (time / 10000) + i;

        if(sphere === hover) {
            sphere.material.wireframe = false
        } else {
            sphere.material.wireframe = true
        }
    })


    renderer.render(scene, camera);

}

renderer.xr.enabled = true;
document.body.appendChild( ARButton.createButton( renderer ) )

renderer.setAnimationLoop(animation);