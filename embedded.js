import * as THREE from 'https://unpkg.com/three@0.141.0/build/three.module.js';

import { ARButton } from 'https://unpkg.com/three@0.141.0/examples/jsm/webxr/ARButton.js'

import { OrbitControls } from 'https://unpkg.com/three@0.141.0/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'https://unpkg.com/three@0.141.0/examples/jsm/renderers/CSS2DRenderer.js'


const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
camera.position.z = 1.5;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setClearAlpha(0)
renderer.setSize( window.innerWidth, window.innerHeight );

document.querySelector('#output').appendChild(renderer.domElement);

const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize( window.innerWidth, window.innerHeight );
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top = '0px';
document.querySelector('#output').appendChild( labelRenderer.domElement );

const controls = new OrbitControls( camera, labelRenderer.domElement )




const spheres = []

const clength = document.querySelectorAll('.item').length;
const step = (2 * Math.PI) / clength;
let angle = 0;
const circle = {
  width: 5,
  depth: 5,
  radius: 2
};


for (const item of document.querySelectorAll('.item')) {
    const title = item.querySelector("h2").innerText;
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

    const color = 0xffffff * Math.random()

    const material = new THREE.MeshBasicMaterial({
        color,
        wireframe: true,
    });

    // https://threejs.org/docs/?q=sphe#api/en/geometries/SphereGeometry
    const sphereRadius = 0.0025 * durationSeconds
    const sphereGeom = new THREE.SphereGeometry(sphereRadius, 6, 6);
    const sphere = new THREE.Mesh(sphereGeom, material);


    sphere.position.y = (Math.random() - 0.5) * 2; 


    sphere.position.x = (circle.width / clength) + (circle.radius * Math.cos(angle));
    sphere.position.z = (circle.depth / clength) + (circle.radius * Math.sin(angle));
    angle += step;

    sphere.rotation.x = Math.random();
    sphere.rotation.y = Math.random();


    

    const sphereTooltip = document.createElement( 'div' );
    sphereTooltip.className = 'label';
    sphereTooltip.textContent = title;
    sphereTooltip.style.marginTop = '-1em';

    const sphereTooltipLabel = new CSS2DObject( sphereTooltip );
    sphereTooltipLabel.position.set( 0, sphereRadius, 0 );
    sphere.add( sphereTooltipLabel );
    sphereTooltipLabel.layers.set( 0 );
    sphereTooltipLabel.visible = false;

    sphere.children[0].visible = false;

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
                playing = audio;
            }
            

            hover = nearest
        }

    }
    
}


function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
    labelRenderer.setSize( window.innerWidth, window.innerHeight );
}

function animation(time) {
    
    controls.update();

    point()

    spheres.forEach((sphere, i) => {
        sphere.rotation.x = (time / 5000) + i;
        sphere.rotation.y = (time / 10000) + i;

        if(sphere === hover) {
            sphere.material.wireframe = false;
            sphere.children[0].visible = true;

            sphere.scale.set(1.5,1.5,1.5);
        } else {
            sphere.material.wireframe = true;
            sphere.children[0].visible = false;
            sphere.scale.set(1,1,1);
        }
    })


    renderer.render(scene, camera);
    labelRenderer.render( scene, camera );

}

renderer.xr.enabled = true;
document.body.appendChild( ARButton.createButton( renderer ) )

window.addEventListener( 'resize', onWindowResize );

renderer.setAnimationLoop(animation);