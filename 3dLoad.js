

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

let camera, scene, renderer, controls;

const info = ["objeto 0: transducción de  RADIANTES de Nicolás Varchanusky / colores de BOCACCION de Raúl Soldi" , "objeto 1","objeto 1","objeto 1","4", "Fotogrametría de tronco con textura de Alberto Grecco"];


var text2 = document.createElement('div');
text2.style.position = 'absolute';
//text2.style.zIndex = 1;    // if you still don't see the label, try uncommenting this
text2.style.width = 100;
text2.style.height = 100;
text2.innerHTML = "MAMBA REMIX";
text2.style.top = 200 + 'px';
text2.style.left = 200 + 'px';
document.body.appendChild(text2);



function textCoords (pos) {
	var vector = projector.projectVector(pos.clone(), camera);
	vector.x = (vector.x + 1)/2 * window.innerWidth;
	vector.y = -(vector.y - 1)/2 * window.innerHeight;
	return vector;
}


			init();
			function init() {
				const container = document.createElement( 'div' );
				document.body.appendChild( container );
				camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.25, 60 );
				camera.position.set( -10, 3, -15 );
	    		
				scene = new THREE.Scene();
				scene.backgroundBlurriness = 0.1;
				//scene.fog = new THREE.FogExp2( 0x000000, 0.15 );

				new RGBELoader()
					.setPath( './models/' )
					.load( 'sky.hdr', function ( texture ) {
    					texture.mapping = THREE.EquirectangularReflectionMapping;
						scene.background = texture;
						scene.environment = texture;
						render();
						
						// model
						const loader = new GLTFLoader().setPath( './models/' );

						loader.load( 'radiantes.glb', async function ( gltf ) {
							const model = gltf.scene;
							await renderer.compileAsync( model, camera, scene );
							scene.add( model );
							render();
			
						} );

					} );

				const color = 0xFFFFFF;
				const intensity = 15;
				const light = new THREE.DirectionalLight(color, intensity);
				light.position.set(0, 10, 0);
				light.target.position.set(-5, 0, 0);
				scene.add(light);
   			    scene.add(light.target);
				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 0.3;
				renderer.setAnimationLoop( animate );
				container.appendChild( renderer.domElement );

				 controls = new OrbitControls( camera, renderer.domElement );
				//controls.addEventListener( 'change', render ); // use if there is no animation loop
				controls.minDistance = 2;
				controls.maxDistance = 200;
				controls.target.set( 0, 0, - 0.2 );
				controls.autoRotate = false;
				controls.autoRotateSpeed = 1;
				controls.update();
				window.addEventListener( 'resize', onWindowResize );
				window.addEventListener( 'pointermove', onPointerMove );
				//window.requestAnimationFrame(render);


			}

			function onWindowResize() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize( window.innerWidth, window.innerHeight );
				render();
			}

			//

			function render() {
		

				renderer.render( scene, camera );
				}
				function onPointerMove( event ) {
									
					pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
					pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

					// calculate pointer position in normalized device coordinates
					// (-1 to +1) for both components
										// update the picking ray with the camera and pointer position
				raycaster.setFromCamera( pointer, camera );
				// calculate objects intersecting the picking ray
				const intersects = raycaster.intersectObjects( scene.children );

				for ( let i = 0; i < intersects.length; i ++ ) {
					//intersects[ i ].object.material.color.set( 0xff0000 );
					//text2.innerHTML = intersects[i].object.name;

					text2.innerHTML = info[intersects[i].object.name];

				}

				
				}

			function animate() {
		
				controls.update();
				renderer.render( scene, camera );
				}

