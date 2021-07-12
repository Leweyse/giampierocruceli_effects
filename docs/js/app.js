import * as THREE from 'three';
import gsap from 'gsap';

import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';

import img1 from "url:./img/img1.jpg";

export default class Sketch {
    constructor() {
        this.scene = new THREE.Scene();

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setPixelRatio( window.devicePixelRatio );
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.container = document.getElementById('container');
        this.container.appendChild( this.renderer.domElement );

        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.z = 1;

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.time = 0;
        this.paused = false;
        this.mouse = new THREE.Vector2();
        this.prevMouse = new THREE.Vector2();
        this.speed = 0;
        this.targetSpeed = 0;

        this.setupResize();

        this.addObjects();
        this.resize();
        this.render();

        this.mouseEvents();
    }

    // settings() {
    //     let that = this;
    //     this.settings = {
    //         time: 0
    //     };
    //     this.gui = new dat.GUI();
    //     this.gui.add(this.settings, 'time', 0, 100, 0.01);
    //     this.gui.addImage(this.settings, 'texturePath').onChange((image) => {
    //         body.append(image);
    //     });
    // }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.imageAspect = 853 / 1280;
        let a1; let a2;

        if (this.height / this.width > this.imageAspect) {
            a1 = (this.width / this.height) * this.imageAspect;
            a2 = 1;
        } else {
            a1 = 1;
            a2 = (this.height / this.width) / this.imageAspect;
        }

        this.material.uniforms.resolution.value.x = this.width;
        this.material.uniforms.resolution.value.y = this.height;
        this.material.uniforms.resolution.value.z = a1;
        this.material.uniforms.resolution.value.w = a2;

        const dist = this.camera.position.z - this.mesh.position.z;
        const height = 1;
        this.camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist))

        if (this.width / this.height > 1) {
            this.mesh.scale.x = this.camera.aspect;
        } else {
            this.mesh.scale.y = 1 / this.camera.aspect;
        }  

        this.camera.updateProjectionMatrix();
    }

    getSpeed() {
        this.speed = Math.sqrt(
            ((this.mouse.x - this.prevMouse.x)**2 + (this.mouse.y - this.prevMouse.y)**2) * Math.PI / 6
        );

        this.targetSpeed += 0.075 * ((this.speed * (Math.PI / 8)) - this.targetSpeed);

        this.prevMouse.x = this.mouse.x;
        this.prevMouse.y = this.mouse.y;
    }

    mouseEvents() {
        document.addEventListener('mousedown', () => {
            this.material.uniforms.direction.value = 0;
            gsap.to(this.material.uniforms.progress, {
                value: 1,
                duration: 0.5
            })
        })

        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (window.Event) ? e.pageX : e.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	        this.mouse.y = (window.Event) ? e.pageY : e.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
            this.mouse.x = this.mouse.x / this.width;
            this.mouse.y = 1.0 - this.mouse.y / this.height;
            this.material.uniforms.mouse.value = this.mouse; 
            console.log(this.material.uniforms.mouse.value)
        });

        document.addEventListener('mouseup', () => {
            this.material.uniforms.direction.value = 1;
            gsap.to(this.material.uniforms.progress, {
                value: 0,
                duration: 0.5
            })
        })
    }

    addObjects() {
        let that = this;

        this.geometry = new THREE.PlaneBufferGeometry( 1, 1, 100, 100 );

        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: '#extension GL_OES_standard_derivatives : enable'
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { type: 'f', value: 0 },
                progress: { type: 'f', value: 0 },
                direction: { type: 'f', value: 0 },
                speed: { type: 'f', value: 0 },
                mouse: { type: 'v2', value: new THREE.Vector2(0.0, 0.0) },
                tex1: {
                    type: 't',
                    value: new THREE.TextureLoader().load(img1)
                },
                resolution: { type: 'v4', value: new THREE.Vector4() },
                uvRate1: {
                    value: new THREE.Vector2(1, 1)
                },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
        });

        this.mesh = new THREE.Mesh( this.geometry, this.material );
	    this.scene.add( this.mesh );
    }

    render() {
        this.time += 0.05;
        this.getSpeed();

        this.material.uniforms.speed.value = this.targetSpeed;
        this.material.uniforms.time.value = this.time;

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render( this.scene, this.camera );
    }
}

new Sketch('container');