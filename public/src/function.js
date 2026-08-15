import * as THREE from 'three';
import { GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/Addons.js';


const OutilDraco = new DRACOLoader()
OutilDraco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/')
OutilDraco.setDecoderConfig({type:'js'})

export function loader_object(
    
    model,
    position,
    scale,
    scene,
    callback
){

    const loader = new GLTFLoader()
    loader.setDRACOLoader(OutilDraco)

    loader.load(model, (gltf)=>{

        const object = gltf.scene

        object.scale.set(...scale)

        object.position.set(...position)

        scene.add(object)

        if(callback){

            callback(object)

        }

    })

}

export{ OutilDraco }