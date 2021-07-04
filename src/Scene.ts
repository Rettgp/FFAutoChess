import * as THREE from "three"
import { OrbitControls } from '@src/thirdparty/OrbitControls.js'
const TWEEN = require('@tweenjs/tween.js');
import {Level, Coordinate} from "@src/levels/Level"
import {Entity} from "@src/Entity"
import * as Characters from "@src/characters/Characters"

export default class Scene
{
    private m_mouse_pos: any = {};
    private m_click_pos: any = {};
    private m_selected_entity: Entity = null;
    private m_entity_selection_tween = null;
    private m_debug_mouse_ele: HTMLElement;
    private m_debug_stats_ele: HTMLElement;
    private m_level: Level;
    private m_entities: Array<Entity>;

    private m_scene = new THREE.Scene();
    private m_entity_scene = new THREE.Scene();
    private m_camera: THREE.OrthographicCamera;
    private m_renderer: THREE.WebGLRenderer;
    private m_raycaster: THREE.Raycaster;
    private m_clock: THREE.Clock;
    private m_controls: any;

    constructor()
    {
        this.m_debug_mouse_ele = document.getElementById("mousePos");
        this.m_debug_stats_ele = document.getElementById("stats");
        let aspect = window.innerWidth / window.innerHeight;
        let d = 20;
        this.m_camera = new THREE.OrthographicCamera( -d * aspect, d * aspect, d, -d, 1, 1000 );
        this.m_renderer = new THREE.WebGLRenderer();
        this.m_renderer.setSize(window.innerWidth, window.innerHeight);
        this.m_renderer.autoClear = false;

        this.m_controls = new OrbitControls(this.m_camera, this.m_renderer.domElement);

        const axesHelper = new THREE.AxesHelper( 15 );
        this.m_scene.add( axesHelper );

        document.body.appendChild(this.m_renderer.domElement);

        this.m_level = new Level(THREE);
        this.m_scene.add(this.m_level.Mesh());

        this.m_camera.position.set( 20, 15, 20 );
        this.m_camera.rotation.order = 'YXZ';
        this.m_camera.rotation.y = - Math.PI / 4;
        this.m_camera.rotation.x = Math.atan( - 1 / Math.sqrt( 2 ) );
        this.m_camera.zoom = 5;

        this.m_controls.enablePan = false;
        this.m_controls.enableRotate = false;

        this.m_raycaster = new THREE.Raycaster();

        this.m_clock = new THREE.Clock();

        this.m_entities = new Array<Entity>();

        {
            var entity = new Characters.Sephiroth(THREE, this.m_entity_scene);
            var pos = this.m_level.ToLevelCoordinate(new Coordinate(1, 0, 2));
            entity.Mesh().position.set(pos.x, 1.5, pos.z);
            this.m_entities.push(entity);
        }
        {
            var entity = new Characters.Tidus(THREE, this.m_entity_scene);
            var pos = this.m_level.ToLevelCoordinate(new Coordinate(1, 0, 0));
            entity.Mesh().position.set(pos.x, 1.5, pos.z);
            this.m_entities.push(entity);
        }

        this.CreateDebugGrid();
        window.addEventListener('mousemove', (e) => { this.OnMouseMove(e) }, false);
        window.addEventListener('click', (e) => { this.OnMouseClick(e) }, false);

        this.Animate(0);
        this.SetupControls();
    }

    private Animate(time)
    {
        requestAnimationFrame((time) => { this.Animate(time) });
        this.m_renderer.clear();
        this.m_renderer.render(this.m_scene, this.m_camera);
        this.m_renderer.clearDepth();
        this.m_renderer.render(this.m_entity_scene, this.m_camera);

        this.m_controls.update();
        var delta = this.m_clock.getDelta();

        // Entity updates
        for (var entity of this.m_entities)
        {
            entity.Update(delta);
        }

        // Raycasting Debugging
        this.m_raycaster.setFromCamera(this.m_mouse_pos, this.m_camera);
        var intersects = this.m_raycaster.intersectObjects(this.m_scene.children);
        for (let i = 0; i < intersects.length; i++)
        {
            if (intersects[i].object.name === "level")
            {
                var level_x = intersects[i].point.x;
                var level_z = intersects[i].point.z;
                var grid_coord = this.m_level.ToGridCoordinate(new Coordinate(level_x, 0, level_z));
                this.m_debug_mouse_ele.innerText = 
                    `X: ${level_x.toFixed(2)}   Z: ${level_z.toFixed(2)}   (${grid_coord.x}, ${grid_coord.z})`;
            }
        }

        TWEEN.update(time);
    }

    private SetupControls()
    {
        document.onkeydown = (e) =>
        {
            if (!this.m_selected_entity)
            {
                return;
            }

            switch (e.code)
            {
                case "Space":
                    this.m_selected_entity.QueueAction("attack", ()=>{});
                    break;
                case "ControlLeft":
                    this.m_selected_entity.QueueAction("limit_break", ()=>{});
                    break;
            }
        };
    }

    private CreateDebugGrid()
    {
        const grid = new DebugGrid( 
            this.m_level.Size().x, this.m_level.Size().z,
            this.m_level.GridSize().x, this.m_level.GridSize().z,
            0xFFFFFF );
        grid.position.set(0, 0.02, 0);
        this.m_scene.add( grid );
    }

    private OnMouseClick(event)
    {
        if (event.button !== 0)
        {
            return;
        }

        if (this.m_entity_selection_tween)
        {
            this.m_entity_selection_tween.repeat(1);
        }

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        let rect = this.m_renderer.domElement.getBoundingClientRect();
        this.m_click_pos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.m_click_pos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.m_raycaster.setFromCamera(this.m_click_pos, this.m_camera);
        // TODO: I dont like this cause you can click the top
        // of the model in another grid cell. Can I do clicking on a grid cell
        // Raycast clicking
        const entity_intersects = 
            this.m_raycaster.intersectObjects(this.m_entity_scene.children, true);
        for (let i = 0; i < entity_intersects.length; i++)
        {
            if (entity_intersects[i].object.visible && 
                entity_intersects[i].object.parent.name === "entity")
            {
                let entity_raycasted: any = entity_intersects[i].object.parent
                let level_x = entity_raycasted.position.x;
                let level_z = entity_raycasted.position.z;
                let grid_coord = this.m_level.ToGridCoordinate(new Coordinate(level_x, 0, level_z));
                this.m_selected_entity = entity_raycasted.entity;
                this.m_debug_stats_ele.innerText = 
                    this.m_selected_entity.stats.StrString() + "\n" +
                    this.m_selected_entity.stats.DexString() + "\n" +
                    this.m_selected_entity.stats.VitString() + "\n" +
                    this.m_selected_entity.stats.AgiString() + "\n" +
                    this.m_selected_entity.stats.IntString() + "\n" +
                    this.m_selected_entity.stats.MndString() + "\n" +
                    this.m_selected_entity.stats.AttackString() + "\n" +
                    this.m_selected_entity.stats.RaString() + "\n" +
                    this.m_selected_entity.stats.DefenseString();

                // TODO: Doesnt work for limit breaks???
                // for (var sprite of entity_raycasted.children)
                // {
                //     if (!sprite.visible)
                //     {
                //         continue;
                //     }
                //     sprite.material.color.setHex(0xFFFFF00);
                //     this.m_entity_selection_tween = new TWEEN.Tween(sprite.material.color)
                //         .to({r: 1, g: 1, b: 1, a: 0 }, 1000)
                //         .easing(TWEEN.Easing.Quartic.In)
                //         .onUpdate(
                //             () =>
                //             {
                //                 sprite.material.color.r = this.r;
                //                 sprite.material.color.g = this.g;
                //                 sprite.material.color.b = this.b;
                //             }
                //         )
                //         .onStop(
                //             () =>
                //             {
                //                 sprite.material.color.r = 1;
                //                 sprite.material.color.g = 1;
                //                 sprite.material.color.b = 1;
                //             }
                //         )
                //         .repeat(Infinity).yoyo(true)
                //         .start();
                // }
            }
        }
    }

    private OnMouseMove( event: any )
    {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        var rect = this.m_renderer.domElement.getBoundingClientRect();
        this.m_mouse_pos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.m_mouse_pos.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
}

class DebugGrid extends THREE.LineSegments 
{
    constructor( width = 10, height = 10, cells_x = 10, cells_y = 10, 
        color1 = 0x444444 ) 
    {
		const geometry = new THREE.BufferGeometry();
        let color = new THREE.Color( color1 );

		const vertices = [], colors = [];

        {
            const step_x = width / cells_x;
            const step_y = width / cells_x;
            const half_width = width / 2;
            const half_height = height / 2;

            for ( var i = -half_width; i <= half_width; i += step_x ) 
            {
                vertices.push(i, 0, -half_height);
                vertices.push(i, 0, half_height);
            }
            for ( var i = -half_height; i <= half_height; i += step_y ) 
            {
                vertices.push(-half_width, 0, i);
                vertices.push(half_width, 0, i);
            }
        }

		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
        var material = new THREE.LineBasicMaterial( { color: color, opacity: 0.5 } );
		super( geometry, material );

		this.type = 'GridHelper';
	}

}