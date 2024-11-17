import * as THREE from 'three';
const TWEEN = require('@tweenjs/tween.js');
import { OrbitControls } from '@src/thirdparty/OrbitControls.js';
import { Level, Coordinate } from '@src/levels/Level';
import { Entity } from '@src/Entity';
import { MeleeAttack } from './attacks/Attacks';
import { Element } from '@src/Elements';
import { ControllerComponent } from '@src/components/ControllerComponent';
import { StatsComponent } from '@src/components/StatsComponent';
import * as Characters from '@src/entities/Characters';
import Calculations from './calculations/Calculations';

export default class Scene {
    private m_mouse_pos: any = {};
    private m_click_pos: any = {};
    private m_selected_entity: Entity = null;
    private m_enemy_selected: Entity = null;
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

    constructor() {
        this.m_debug_mouse_ele = document.getElementById('mousePos');
        this.m_debug_stats_ele = document.getElementById('stats');
        let aspect = window.innerWidth / window.innerHeight;
        let d = 20;
        this.m_camera = new THREE.OrthographicCamera(
            -d * aspect,
            d * aspect,
            d,
            -d,
            1,
            1000,
        );
        this.m_renderer = new THREE.WebGLRenderer();
        this.m_renderer.setSize(window.innerWidth, window.innerHeight);
        this.m_renderer.autoClear = false;

        this.m_controls = new OrbitControls(
            this.m_camera,
            this.m_renderer.domElement,
        );

        const axesHelper = new THREE.AxesHelper(15);
        this.m_scene.add(axesHelper);

        document.body.appendChild(this.m_renderer.domElement);

        this.m_level = new Level(THREE);
        this.m_scene.add(this.m_level.Mesh());

        this.m_camera.position.set(20, 15, 20);
        this.m_camera.rotation.order = 'YXZ';
        this.m_camera.rotation.y = -Math.PI / 4;
        this.m_camera.rotation.x = Math.atan(-1 / Math.sqrt(2));
        this.m_camera.zoom = 5;

        this.m_controls.enablePan = false;
        this.m_controls.enableRotate = false;

        this.m_raycaster = new THREE.Raycaster();

        this.m_clock = new THREE.Clock();

        this.m_entities = new Array<Entity>();

        {
            var entity = new Characters.Sephiroth(THREE, true);
            var pos = this.m_level.ToLevelCoordinate({ x: 0, y: 0, z: 2 });
            entity.Mesh().position.set(pos.x, 1.5, pos.z);
            this.m_entity_scene.add(entity.Mesh());
            this.m_entities.push(entity);
        }
        {
            var entity = new Characters.Tidus(THREE);
            var pos = this.m_level.ToLevelCoordinate({ x: 1, y: 0, z: 0 });
            entity.Mesh().position.set(pos.x, 1.5, pos.z);
            this.m_entity_scene.add(entity.Mesh());
            this.m_entities.push(entity);
        }

        this.CreateDebugGrid();
        window.addEventListener(
            'mousemove',
            e => {
                this.OnMouseMove(e);
            },
            false,
        );
        window.addEventListener(
            'click',
            e => {
                this.OnMouseClick(e);
            },
            false,
        );
        window.addEventListener(
            'contextmenu',
            e => {
                this.OnMouseClick(e);
            },
            false,
        );

        this.Animate();
        this.ListenForKeyboard();
    }

    private Animate() {
        requestAnimationFrame(() => {
            this.Animate();
        });
        this.m_renderer.clear();
        this.m_renderer.render(this.m_scene, this.m_camera);
        this.m_renderer.clearDepth();
        this.m_renderer.render(this.m_entity_scene, this.m_camera);

        this.m_controls.update();
        var delta = this.m_clock.getDelta();

        // Entity updates
        for (var entity of this.m_entities) {
            entity.Update(this.m_level, delta);
        }

        // Raycasting Debugging
        this.m_raycaster.setFromCamera(this.m_mouse_pos, this.m_camera);
        var intersects = this.m_raycaster.intersectObjects(
            this.m_scene.children,
        );
        for (let i = 0; i < intersects.length; i++) {
            if (intersects[i].object.name === 'level') {
                var level_x = intersects[i].point.x;
                var level_z = intersects[i].point.z;
                var grid_coord = this.m_level.ToGridCoordinate({
                    x: level_x,
                    y: 0,
                    z: level_z,
                });
                this.m_debug_mouse_ele.innerText = `X: ${level_x.toFixed(2)}   Z: ${level_z.toFixed(2)}   (${grid_coord.x}, ${grid_coord.z})`;
            }
        }

        TWEEN.update(delta);
    }

    private ListenForKeyboard() {
        document.onkeydown = e => {
            if (this.m_selected_entity) {
                let controller = this.m_selected_entity.FindComponent(
                    'controller',
                ) as ControllerComponent;
                controller?.OnKeyPressed(e);
            }
        };
    }

    private CreateDebugGrid() {
        const grid = new DebugGrid(
            this.m_level.Size().x,
            this.m_level.Size().z,
            this.m_level.GridSize().x,
            this.m_level.GridSize().z,
            0xffffff,
        );
        grid.position.set(0, 0.02, 0);
        this.m_scene.add(grid);
    }

    private OnMouseClick(event) {
        if (event.button !== 0 && event.button !== 2) {
            return;
        }

        if (this.m_entity_selection_tween) {
            this.m_entity_selection_tween.repeat(1);
        }

        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        let rect = this.m_renderer.domElement.getBoundingClientRect();
        this.m_click_pos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.m_click_pos.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.m_raycaster.setFromCamera(this.m_click_pos, this.m_camera);
        // TODO: I dont like this cause you can click the top
        // of the model in another grid cell. Can I do clicking on a grid cell
        // Raycast clicking
        const entity_intersects = this.m_raycaster.intersectObjects(
            this.m_entity_scene.children,
            true,
        );

        console.log(entity_intersects);
        for (let i = 0; i < entity_intersects.length; i++) {
            // TODO: This is messing around with propeties to get the Entity, FIX IT
            let object3D: any = entity_intersects[i].object;
            while (object3D.name !== 'entity' && object3D.parent !== null) {
                object3D = object3D.parent;
            }

            if (object3D.name === 'entity' && object3D.visible) {
                if (event.button === 2) {
                    this.m_enemy_selected = object3D.entity as Entity;
                    break;
                }
                this.m_selected_entity = object3D.entity as Entity;
                const statsComponent = this.m_selected_entity.FindComponent(
                    'stats',
                ) as StatsComponent;
                if (statsComponent) {
                    this.m_debug_stats_ele.innerText =
                        statsComponent.AttributesToString();
                }
            }
        }
    }

    private OnMouseMove(event: any) {
        // calculate mouse position in normalized device coordinates
        // (-1 to +1) for both components
        var rect = this.m_renderer.domElement.getBoundingClientRect();
        this.m_mouse_pos.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.m_mouse_pos.y =
            -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }
}

class DebugGrid extends THREE.LineSegments {
    constructor(
        width = 10,
        height = 10,
        cells_x = 10,
        cells_y = 10,
        color1 = 0x444444,
    ) {
        const geometry = new THREE.BufferGeometry();
        let color = new THREE.Color(color1);

        const vertices = [],
            colors = [];

        {
            const step_x = width / cells_x;
            const step_y = width / cells_x;
            const half_width = width / 2;
            const half_height = height / 2;

            for (var i = -half_width; i <= half_width; i += step_x) {
                vertices.push(i, 0, -half_height);
                vertices.push(i, 0, half_height);
            }
            for (var i = -half_height; i <= half_height; i += step_y) {
                vertices.push(-half_width, 0, i);
                vertices.push(half_width, 0, i);
            }
        }

        geometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(vertices, 3),
        );
        var material = new THREE.LineBasicMaterial({
            color: color,
            opacity: 0.5,
        });
        super(geometry, material);
    }
}
