import * as THREE from 'three';
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';


export const size = {

    width : window.innerWidth,
    height : window.innerHeight
}

// ------------Instanciation des Elements de base
export const scene= new THREE.Scene();
const camera =new THREE.PerspectiveCamera(75, size.width/size.height,0.1,1000);
       camera.position.set(3.5427994868666355,1.8541301897276905,9.382159096197288)

const renderer= new THREE.WebGLRenderer({ antialias:true, canvas:document.querySelector('#bg') });
       // --------------------Correction Tone Mapping
       renderer.toneMapping =
            THREE.ACESFilmicToneMapping

        renderer.toneMappingExposure = .70

        renderer.outputColorSpace =
            THREE.SRGBColorSpace

        //--------------------------------

        renderer.shadowMap.enabled = true
        renderer.shadowMap.type =
            THREE.PCFSoftShadowMap
        
        // ------------------Mise en place du rendu
        renderer.setSize(size.width, size.height,0.1, 1000  );
        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        )
        document.body.appendChild( renderer.domElement );

const controls =new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,0,0)
    controls.enableDamping = true;


export { THREE, GLTFLoader, OrbitControls ,renderer, controls, camera};