
import { scene,camera,renderer,controls,size,THREE,GLTFLoader,OrbitControls } from './base'; 
import { loader_object } from './function';
import { OutilDraco } from './function';

import gsap from 'gsap';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'     



// ------------Special Contact 
let isContactTransition = false
let leavingContact = false


// ------------Mise En Place mobile
const isMobile = window.innerWidth < 768
if(isMobile){
    
    controls.enabled = false
}

// ---------------------------------QUAND PAS MOBILE

if(!isMobile){

    // -------------SPACE BG
    const SpaceBg = new THREE.TextureLoader().load('/textures/space.jpg');
    SpaceBg.colorSpace = THREE.SRGBColorSpace;
    scene.background = SpaceBg;

    // ------------RAYCASTING ET DETECTIO DES OBJETS 
    const raycaster = new THREE.Raycaster();
    raycaster.params.Points.threshold = 50
    const pointer = new THREE.Vector2();

    // -------------------STOCKAGE DES NOMS CLICKABLE 
    let intersects = [];
    let CurrentObjects = [];
    let intersectObjectName = [

        'globe_constellation',
        'dice_constellation'

    ]

    // ------------Selection section main block
    let main_section = document.querySelector('.main_block')
    console.log(main_section);

    //------------Transition de la fusee
    let rocketTransition = false

    let rocketStartPosition =
        new THREE.Vector3()

    let rocketEndPosition =
        new THREE.Vector3()
    // -----------Transition de la page
    let nextSection = null

    let isTransitioning = false

    let transitionStart = 0

    let transitionDuration = 3000

    let startPosition = new THREE.Vector3()

    let endPosition = new THREE.Vector3()

    let startTarget = new THREE.Vector3()

    let endTarget = new THREE.Vector3()

    // --------------------------------------------

    // -----------------Coordonnee de la navigation
    const sections = {
        home: {
            position: new THREE.Vector3(3.5427994868666355,1.8541301897276905,9.382159096197288),
            target: new THREE.Vector3(
                0,
                0,
                0
            )

        },

        about: {
            position: new THREE.Vector3(20,-50,15),
            target: new THREE.Vector3(20,-50,0)
        },

        skills: {
            position: new THREE.Vector3(-20,-100,15),
            target: new THREE.Vector3(-20,-100,0)
        },

        projects: {
            position: new THREE.Vector3(10.333712817939535,-150.81499878448867,15),
            target: new THREE.Vector3(10.333712817939535,-150.81499878448867,0)
        },

        contact: {
            position: new THREE.Vector3(-20,-200,15),
            target: new THREE.Vector3(-20,-200,0)
        }
    }
    let currentSection = 'home'

    // ----------------Creation des groups de section de la page 
    const homeGroup = new THREE.Group()
    scene.add(homeGroup)

    const aboutGroup = new THREE.Group()
    scene.add(aboutGroup)

    const skillsGroup = new THREE.Group()
    scene.add(skillsGroup)

    const projectsGroup = new THREE.Group()
    scene.add(projectsGroup)

    const contactGroup = new THREE.Group()
    scene.add(contactGroup)

    // ----------------Positionnement des Groups de la page
    homeGroup.position.set(0,0,0)
    aboutGroup.position.set(20,-50,0)
    skillsGroup.position.set(-20,-100,0)
    projectsGroup.position.set(20,-150,0)
    contactGroup.position.set(-20,-200,0)

   
    // -------------Ajout BLOOM pour emessive

    // ----------pour le layer selectionner special
    const bloomLayer = new THREE.Layers()

    const composer =
        new EffectComposer(renderer)

    const renderPass =
        new RenderPass(scene, camera)

    composer.addPass(renderPass)

    const bloomPass =
        new UnrealBloomPass(

            new THREE.Vector2(
                window.innerWidth,
                window.innerHeight
            ),

            .25, // intensity
            0.8, // radius
            0.2  // threshold

        )

    composer.addPass(bloomPass)

    // -------------Ajout lumiere
    const light_principal = new THREE.AmbientLight(0xfffff, 2)
    scene.add(light_principal)

    const light_soleil = new THREE.DirectionalLight(0xfffff, 2)
    light_soleil.position.set(5,5,100)
    scene.add(light_soleil)

    // -----------------Lune
    const moonTexture = new THREE.TextureLoader().load('/textures/lune.png');
    moonTexture.colorSpace = THREE.SRGBColorSpace;
    const moon = new THREE.Mesh(
        new THREE.SphereGeometry(3,32,32),
        new THREE.MeshBasicMaterial({map:moonTexture})
    )
    moon.position.set(-12,-1,-5)
    scene.add(moon)
    // ---------------Ajout de La fusee----

    // -----------test boutique
    
    let fusee =null
    const fuseeBaseY = 0
    loader_object(

        '/model/fusee.glb',[5,0,0],[0.5,0.5,0.5],scene,

        (loadedObject)=>{

            fusee = loadedObject
        }

    )

        // -------------Particule de la fusee
        const rocketParticles = []

        const particleGeometry =
            new THREE.SphereGeometry(
                0.08,
                8,
                8
            )

        const particleMaterial =
            new THREE.MeshBasicMaterial({
                color: 0xffaa00
        })
    // ---------------Ajout station spatiale-----
    let station_spatiale = null
    let stationBaseY = 4
    loader_object(

        '/model/station_spatiale.glb',[0,stationBaseY,-18],[1.2,1.2,1.2],scene,

        (loadedObject)=>{
            station_spatiale = loadedObject
        }
    )

    // -------------Ajout Planete About
    let planete_about = null;
    const planeteBaseY = -2

    loader_object( 
        
        '/model/planete_about.glb' , [9,planeteBaseY ,5], [1,1,1], aboutGroup,

        (loadedObject)=>{

            planete_about = loadedObject
        }
    )

    // -------------Ajout des asteroides
    let asteroide = null
    let php =null
    let git =null
    let laravel = null
    let vue = null
    let blender = null 

    const phpBaseY = -1
    const gitBaseY = 3
    const laravelBaseY = -2
    const vueBaseY = 4
    const blenderBaseY = -3
    const loader_asteroide = new GLTFLoader()
    loader_asteroide.setDRACOLoader(OutilDraco)

    loader_asteroide.load('/model/skills.glb',(gltf)=>{

        asteroide = gltf.scene

        asteroide.scale.set(
            .5,.5,.5
        )
        asteroide.position.set(
            -8,-1,5
        )

        // -------------------reafectation des enfants
        php =
        asteroide.getObjectByName(
            'asteroide_php'
        )

        php.position.z = -5


        laravel =
        asteroide.getObjectByName(
            'asteroide_lara'
        )

        laravel.position.z = 6
        laravel.position.y = 4

        git =
        asteroide.getObjectByName(
            'asteroide_git'
        )

        git.position.z = -1

        vue =
        asteroide.getObjectByName(
            'asteroide_vue'
        )

        // ------------------------------------------
        
        skillsGroup.add(asteroide)
    })

    // -------------Ajout GALAXY
    // ==========================================

    let galaxy = null

    const galaxyParameters = {

        count: 15000,

        size: 0.075,

        radius:10,

        branches: 6,

        spin: 2.8,

        randomness: 0.12,

        randomnessPower: 5,

        insideColor: '#ffffff',

        outsideColor: '#4ffcff'
    }

    const galaxyGeometry =
        new THREE.BufferGeometry()

    const positions =
        new Float32Array(
            galaxyParameters.count * 3
        )

    const colors =
        new Float32Array(
            galaxyParameters.count * 3
        )

    const colorInside =
        new THREE.Color(
            galaxyParameters.insideColor
        )

    const colorOutside =
        new THREE.Color(
            galaxyParameters.outsideColor
        )

    for(
        let i = 0;
        i < galaxyParameters.count;
        i++
    ){

        const i3 = i * 3

        // ---------------- Rayon
        const radius =
            Math.random() *
            galaxyParameters.radius

        // ---------------- Spirale
        const branchAngle =
            (
                i %
                galaxyParameters.branches
            ) /
            galaxyParameters.branches *
            Math.PI * 2

        const spinAngle =
            radius * 0.9 *
            galaxyParameters.spin
        // ---------------- Random
        const randomX =
            Math.pow(
                Math.random(),
                galaxyParameters.randomnessPower
            ) *
            (
                Math.random() < 0.5
                ? 1
                : -1
            )

            * galaxyParameters.randomness
            * radius

        const randomY =
            Math.pow(
                Math.random(),
                galaxyParameters.randomnessPower
            ) *
            (
                Math.random() < 0.5
                ? 1
                : -1
            )

            * galaxyParameters.randomness
            * radius * 0.2

        const randomZ =
            Math.pow(
                Math.random(),
                galaxyParameters.randomnessPower
            ) *
            (
                Math.random() < 0.5
                ? 1
                : -1
            )

            * galaxyParameters.randomness
            * radius

        // ---------------- Positions
        positions[i3] =

            Math.cos(
                branchAngle +
                spinAngle
            )

            * radius
            + randomX

        positions[i3 + 1] =
            randomY

        positions[i3 + 2] =

            Math.sin(
                branchAngle +
                spinAngle
            )

            * radius
            + randomZ

        // ---------------- Couleurs
        const mixedColor =
            colorInside.clone()

        mixedColor.lerp(
            colorOutside,
            radius /
            galaxyParameters.radius
        )

        colors[i3] =
            mixedColor.r

        colors[i3 + 1] =
            mixedColor.g

        colors[i3 + 2] =
            mixedColor.b

        const intensity =
            1 - (radius / galaxyParameters.radius)

        mixedColor.multiplyScalar(
            1 + intensity * 3
        )
    }

    galaxyGeometry.setAttribute(

        'position',

        new THREE.BufferAttribute(
            positions,
            3
        )
    )

    galaxyGeometry.setAttribute(

        'color',

        new THREE.BufferAttribute(
            colors,
            3
        )
    )

    // TEXTURE PARTICULE
    // ==========================================

    const galaxyTexture =
        new THREE.TextureLoader().load(
            '/textures/particle.png'
        )

    const galaxyMaterial =
        new THREE.PointsMaterial({

            size: galaxyParameters.size,

            sizeAttenuation: true,

            depthWrite: false,

            blending: THREE.AdditiveBlending,

            // transparent: true,

            opacity: 1,

            vertexColors: true,

            map: galaxyTexture
    })
    galaxyMaterial.color.multiplyScalar(3.5)

    galaxy =
        new THREE.Points(
            galaxyGeometry,
            galaxyMaterial
        )

    // ---------------- Position galaxie
    galaxy.position.set(
        -1,
        -1,
        7
    )
    galaxy.scale.set(
        2.8,
        0.18,
        1.4
    )

    // ---------------- Rotation
    galaxy.rotation.x =
        Math.PI * .35

    galaxy.rotation.z =
        Math.PI * -0.12

    projectsGroup.add(galaxy)


    // ------------Addition Etoile

        const starsGeometry =
            new THREE.BufferGeometry()

        let count_star = 5000
        if (isMobile){
            count_star = 500
        }
        const starsCount = count_star

        const Positions = []

        for (
            let i = 0;
            i < starsCount;
            i++
        ) {

            Positions.push(
                (Math.random() - 0.5) * 200
            )

            Positions.push(
                (Math.random() - 0.5) * 200
            )

            Positions.push(
                (Math.random() - 0.5) * 200
            )

        }

        starsGeometry.setAttribute(

            'position',

            new THREE.Float32BufferAttribute(
                Positions,
                3
            )

        )

        const stars =
            new THREE.Points(

                starsGeometry,

                new THREE.PointsMaterial({

                    size: 0.15
                    
                })

            )

        scene.add(stars)
    // --------------Ajout des constellations
    let constellation =null
    const loader_constellation = new GLTFLoader()
    loader_constellation.setDRACOLoader(OutilDraco)

    loader_constellation.load(
        '/model/constellation.glb',
        (gltf)=>{

        constellation = gltf.scene
        
        constellation.scale.set(
            1,
            1,
            1
        )

        constellation.position.set(
            -17,
            0.75,
            7.5
        )

        // ---------------- Rotation
        constellation.rotation.y =
            Math.PI * 1.25

        constellation.rotation.x =
            Math.PI * -0.055

        // -------------Hitbox
        const hitbox_constellation = new THREE.Mesh(

            new THREE.BoxGeometry(3.5, 2.5, 2.5),

            new THREE.MeshBasicMaterial({
                transparent: true,
                opacity: 0
            })

        )

        hitbox_constellation.name = 'globe_constellation_hitbox'

        hitbox_constellation.position.set(0, 0, 0)

        constellation.add(hitbox_constellation)

        CurrentObjects.push(hitbox_constellation)

        // --------------------------------------

        projectsGroup.add(constellation)

        // ------------------Detection du click
        // constellation.traverse((child)=>{

        //     if(intersectObjectName.includes(child.name)){

        //         CurrentObjects.push(child)

        //     }

        // })
            
    })


    let constellation_dice = null
    const loader_constellation_dice = new GLTFLoader()
    loader_constellation_dice.setDRACOLoader(OutilDraco)
    loader_constellation_dice.load('/model/constellation_dice.glb',(gltf)=>{

        constellation_dice = gltf.scene

        constellation_dice.scale.set( .5,.5,.5)
        constellation_dice.position.set(
            -11,
            -6.25,
            5
        )


        const hitbox_constellation_dice = new THREE.Mesh(

            new THREE.BoxGeometry(12.5, 3.5, 1.75),
            new THREE.MeshBasicMaterial({

                transparent: true,
                opacity: 0
            })
        )

        hitbox_constellation_dice.name = 'dice_constellation_hitbox'
        hitbox_constellation_dice.position.set(5.5, 3.5, 0)

        constellation_dice.add(hitbox_constellation_dice)

        CurrentObjects.push(hitbox_constellation_dice)

        projectsGroup.add(constellation_dice)
    })

    // -------------Choix affiche Section

    const navBarLink = document.querySelector('.navbar')

    const closeProject = document.querySelectorAll('.close_project');
        closeProject.forEach(button => {

                button.addEventListener('click', () => {

                    navBarLink.style.display = 'flex'

                    const projectModal =
                        button.closest('.Mes_projets')

                    projectModal.style.display = 'none'

                    gsap.to(camera.position,{

                        duration:1.5,
                        x:10.333712817939535,
                        y:-150.81499878448867,
                        z:15,

                        ease: "power2.out"

                    });

                    gsap.to(controls.target,{

                        duration:1.5,
                        x:10.333712817939535,
                        y:-150.81499878448867,
                        z:0,

                        ease: "power2.out",

                        onUpdate: () => {
                            controls.update();
                        },

                    });

                })

            })

    function showSection(sectionName){

        const sections =
            document.querySelectorAll('main section')

        sections.forEach(section => {

            section.classList.remove('active')
            section.classList.add('section-hidden')

        })

        const activeSection =
            document.getElementById(sectionName)

        if(activeSection){

            activeSection.classList.remove('section-hidden')
            activeSection.classList.add('active')

        }
    }
    showSection('home')

    // ------------RESIZE ECRAN---------------
    function updateCameraPosition(){

        if(window.innerWidth < 768){

            camera.position.set(
                0,
                5,
                35
            )

            camera.fov = 150

        }else{

            camera.position.set(
                3.54,
                1.85,
                9.38
            )

            camera.fov = 75

        }

        camera.updateProjectionMatrix()

    }
    updateCameraPosition()

    window.addEventListener('resize', () => {

        size.width = window.innerWidth
        size.height = window.innerHeight

        camera.aspect = size.width / size.height
        camera.updateProjectionMatrix()

        renderer.setSize(size.width, size.height)

        composer.setSize(size.width, size.height)
        bloomPass.setSize(size.width, size.height)

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        )
    })

    // ---------Ecoute Click Lien------------
    function navigateToSection(sectionName){

        if(isMobile){

            currentSection = sectionName

            showSection(sectionName)

                return
        }
        if(isTransitioning) return

        if(sectionName === currentSection) return

        const target =
            sections[sectionName]

        startPosition.copy(
            camera.position
        )

        startTarget.copy(
            controls.target
        )

        endPosition.copy(
            target.position
        )

        endTarget.copy(
            target.target
        )

        transitionStart =
            performance.now()
        // ---------------La fussee
        if(fusee){

            rocketStartPosition.copy(
                fusee.position
            )

            const rocketDestinations = {

                home: new THREE.Vector3(5,0,0),

                about: new THREE.Vector3(
                    25,
                    -47,
                    0
                ),

                skills: new THREE.Vector3(
                    -15,
                    -95,
                    0
                ),

                projects: new THREE.Vector3(
                    25,
                    -145,
                    0
                ),

                contact: new THREE.Vector3(
                    -5,
                    -198,
                    0
                )


            }
        rocketEndPosition.copy(
                rocketDestinations[sectionName]
            )

            // ------reorientation fusee sur voyage 
            const direction =
                new THREE.Vector3()

            direction.subVectors(
                rocketEndPosition,
                rocketStartPosition
            )

            fusee.rotation.z =
                Math.atan2(
                    direction.y,
                    direction.x
                )- Math.PI / 2

            // ===== TRANSITION CONTACT =====

            isContactTransition =
                sectionName === 'contact'

            leavingContact =
                currentSection === 'contact'

            rocketTransition = true

        }
        // --------------------------
        isTransitioning = true

        nextSection = sectionName
        console.log(sectionName);
        
        controls.update()

        // -----------Remise de z -index normale de main_block
    
    }

    document
    .querySelectorAll('[data-section]')
    .forEach(link => {

        link.addEventListener('click', (e) => {

            e.preventDefault()

            const targetSection =
                e.currentTarget.dataset.section

            navigateToSection(targetSection)

        })
    })


    // -------------MISE A JOUR DE LA POSITION DE LA SOURIS
    window.addEventListener('mousemove', (event)=>{

        pointer.x =
            (event.clientX / window.innerWidth) * 2 - 1

        pointer.y =
            -(event.clientY / window.innerHeight) * 2 + 1

    })
    // ----------------EVENEMENT CLICK
    function onClick(){

        if (intersects.length > 0){
            
            const clickedObject = intersects[0].object

            if (clickedObject.name == 'globe_constellation_hitbox'){
                
                // console.log('voila mon globe');
                navBarLink.style.display = 'none'
                const globe_p = document.querySelector('.globe_project')
                globe_p.style.display = 'block'

                gsap.to(camera.position, {
                    duration: 1.5,
                    x: 7.057262999846927,
                    y: -147.4945312100964,
                    z: 9.035688979605197,
                    ease: "power2.out"
                });

                // POINT REGARDÉ
                gsap.to(controls.target, {
                    duration: 1.5,

                    x:  2.3097651209569316,
                    y: -151.27912755818463,
                    z: 1.7892197686675215,

                    ease: "power2.out",

                    onUpdate: () => {
                        controls.update();
                    },

                });
                
                
            }
            if (clickedObject.name == 'dice_constellation_hitbox'){
                
                navBarLink.style.display = 'none'
                const dice_p = document.querySelector('.dice_project')
                dice_p.style.display = 'block'

                gsap.to(camera.position, {
                    duration: 1.5,
                    x: 13.163010651856176,
                    y: -155.4322001024383,
                    z: 13.381618846916512,
                    ease: "power2.out"
                });

                // POINT REGARDÉ
                gsap.to(controls.target, {
                    duration: 1.5,

                    x: 15.953754726882545,
                    y: -157.16958691577412,
                    z: 0.4840125692344032,

                    ease: "power2.out",

                    onUpdate: () => {
                        controls.update();
                    },

                });
                
                
            }
            
        }
    }
    window.addEventListener('click', onClick)


    // -----------RUN APLLICATION-------------

    function animate(time){

        if(!isMobile){

            controls.update()

        }
        const elapsedTime = time * 0.001

        // ------Animation objets 3d 
        if(
            fusee &&
            !rocketTransition
        ){

            if(currentSection === 'home'){

                fusee.position.y =
                    fuseeBaseY +
                    Math.sin(elapsedTime * 2) * 0.35

                fusee.rotation.z =
                    Math.sin(elapsedTime * 2) * 0.05

            }

            if(currentSection === 'contact'){

                fusee.position.y =
                    -198 +
                    Math.sin(elapsedTime * 2) * 0.35

                fusee.rotation.z =
                    Math.sin(elapsedTime * 2) * 0.05

            }
        }
        if(station_spatiale){

            station_spatiale.rotation.y += 0.003

            station_spatiale.position.y =
                stationBaseY +
                Math.sin(elapsedTime * 0.8) * 0.25

        }
        if(planete_about){

            planete_about.rotation.y += 0.002
            planete_about.position.y =
                planeteBaseY +
                Math.sin(elapsedTime * 0.5) * 0.2

        }
        if(asteroide){

            php.position.y =
            phpBaseY +
            Math.sin(elapsedTime * 1) * 0.5

            git.position.y =
            phpBaseY +
            Math.sin(elapsedTime * .75) * 0.25

            laravel.position.y =
            phpBaseY +
            Math.sin(elapsedTime * 1) * 0.75

            vue.position.y =
            vueBaseY +
            Math.sin(elapsedTime * .75) * 0.75

            
        }
        if(galaxy){
        
            galaxy.rotation.y += 0.00005

            // reset discret
            if(galaxy.rotation.y > 0.85){

                galaxy.rotation.y = 0

            }
            
        }
        // ----------------Animation de la Transition
        if(isTransitioning){

            const elapsed =
                performance.now() -
                transitionStart

            let progress =
                elapsed / transitionDuration

            progress =
                Math.min(progress, 1)

            progress =
                progress * progress * (3 - 2 * progress)

            camera.position.lerpVectors(
                startPosition,
                endPosition,
                progress
            )

            controls.target.lerpVectors(
                startTarget,
                endTarget,
                progress
            )

            if(progress === 1){

                rocketTransition = false

                isTransitioning = false

                currentSection = nextSection

                showSection(currentSection)

                // CONTACT STYLE
                // =========================

            if(currentSection === 'contact'){

                    fusee.rotation.z = 6
                    fusee.rotation.x = 0.1

                }else{

                    fusee.rotation.z = 0
                    fusee.rotation.x = 0

                }

            }

        }
        // -------------------------------------
        moon.rotation.y += .005

        // ---------------Fusee
        if(
        rocketTransition &&
        fusee
        ){

            // PARTICULES
            const particle =
                new THREE.Mesh(
                    particleGeometry,
                    particleMaterial.clone()
                )

            particle.position.copy(
                fusee.position
            )

            scene.add(particle)

            rocketParticles.push({
                mesh: particle,
                life: 1
            })


            // 
            const elapsed =
                performance.now() -
                transitionStart

            let progress =
                elapsed /
                transitionDuration

            progress =
                progress * progress * (3 - 2 * progress)

            // POSITION
            // =====================

            if(isContactTransition || leavingContact){

                fusee.position.lerpVectors(
                    rocketStartPosition,
                    rocketEndPosition,
                    progress
                )

                const curveStrength =
                    Math.sin(progress * Math.PI)

                // COURBE VERS CAMERA
                fusee.position.z +=
                    curveStrength * 5

                // COURBE LATERALE
                fusee.position.x -=
                    curveStrength * 7.5

                // COURBE VERTICALE
                fusee.position.y +=
                    curveStrength * 4


            }else{

                fusee.position.lerpVectors(
                    rocketStartPosition,
                    rocketEndPosition,
                    progress
                )

            }

            // SCALE
            // =====================

            if(isContactTransition){

                const scale =
                    0.5 + (progress * 0.7)

                fusee.scale.set(
                    scale,
                    scale,
                    scale
                )

            }

            if(leavingContact){

                const scale =
                    1.2 - (progress * 0.7)

                fusee.scale.set(
                    scale,
                    scale,
                    scale
                )

            }

        }
        // ANIMATION PARTICULES
        for(
            let i = rocketParticles.length - 1;
            i >= 0;
            i--
        ){

            const particle =
                rocketParticles[i]

            particle.life -= 0.03

            particle.mesh.scale.multiplyScalar(
                0.96
            )

            particle.mesh.material.opacity =
                particle.life

            particle.mesh.material.transparent =
                true

            if(particle.life <= 0){

                scene.remove(
                    particle.mesh
                )

                rocketParticles.splice(i,1)
            }
        }

        // ---------DETEECTION OBJET CLICK 

        raycaster.setFromCamera(pointer,camera)
        intersects = raycaster.intersectObjects(CurrentObjects);

        if(intersects.length > 0){

            document.body.style.cursor = 'pointer'
        }else{
            document.body.style.cursor = 'default'
        }
        
        // renderer.render(scene,camera)
        composer.render()
    }

    renderer.setAnimationLoop(animate)


    window.addEventListener('keydown', (e)=>{

        if(e.key === 'p'){

            console.log(
                'camera position :',
                camera.position
            )

            console.log(
                'controls target :',
                controls.target
            )

        }

    })

}


