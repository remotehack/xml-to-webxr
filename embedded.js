import confetti from 'https://cdn.skypack.dev/canvas-confetti';
import * as THREE from 'https://cdn.skypack.dev/three';
import parseDuration from "https://cdn.skypack.dev/parse-duration";

console.log("EMBEDDED SCRIPT!", confetti)

confetti();




const camera = new THREE.PerspectiveCamera(70, 1, 0.01, 10);
camera.position.z = 1.5;

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });

// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(700, 700);
// renderer.setAnimationLoop(animation);

document.querySelector('#output').appendChild(renderer.domElement);




// https://threejs.org/docs/?q=sphe#api/en/geometries/SphereGeometry
const sphereGeom = new THREE.SphereGeometry(.06, 6, 6);

const spheres = []

for (const item of document.querySelectorAll('.item')) {
    const title = item.querySelector("h2").innerText;
    const description = item.querySelector("p").innerText;
    const link = item.querySelector("a").getAttribute("href");
    const durationString = item
        .querySelector("a")
        .querySelector("span").innerText;
    console.log(parseDuration('00:01:41'));
    // duration = parseDuration(durationString)

    // console.log({ title, description, link, duration });

    const material = new THREE.MeshBasicMaterial({
        color: 0xffffff * Math.random(),
        wireframe: true,
    });
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
    };
}

const playing = new Set();

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove(event) {
    pointer.x = (event.offsetX / 700) * 2 - 1;
    pointer.y = - (event.offsetY / 700) * 2 + 1;
}

renderer.domElement.addEventListener("mousemove", onPointerMove)

renderer.domElement.addEventListener("mousedown", () => {
    console.log("DOWN")
})





function animation(time) {

    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);
    for (const intersect of intersects) {
        const sphere = intersect.object;
        sphere.material.color.set(0xff0000);

        if (!playing.has(sphere)) {
            console.log("...", sphere)

            playing.add(sphere)

            sphere.userData?.play?.()
        }
    }


    spheres.forEach((sphere, i) => {
        sphere.rotation.x = (time / 5000) + i;
        sphere.rotation.y = (time / 10000) + i;
    })

    renderer.render(scene, camera);

}


renderer.setAnimationLoop(animation);