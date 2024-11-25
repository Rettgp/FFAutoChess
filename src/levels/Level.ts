import ASSETS from '@src/AssetLoader';
import { Entity } from '@src/entities/Entity';
import { Mesh, Scene } from 'three';

export interface Coordinate {
    x: number;
    y: number;
    z: number;
}

export class Level {
    private _three: any;
    private _material: any;
    private _plane_size: { x: number; y: number; z: number };
    private _geometry: any;
    private _cube: Mesh;
    private _entities: Entity[] = [];
    private _entity_scene: Scene;

    constructor(three) {
        this._three = three;
        const texture = new this._three.TextureLoader().load(ASSETS.GRASS);

        this._plane_size = { x: 10, y: 0, z: 15 };
        this._material = new this._three.MeshBasicMaterial({
            map: texture,
        });
        this._geometry = new this._three.BoxGeometry(
            this._plane_size.x,
            this._plane_size.y,
            this._plane_size.z,
        );
        this._cube = new this._three.Mesh(this._geometry, this._material);
        this._cube.name = 'level';

        this._entity_scene = new this._three.Scene();
    }

    public Update(delta: number) {
        // Entity updates
        for (let entity of this._entities) {
            entity.Update(this, delta);
        }
    }

    public Mesh(): Mesh {
        return this._cube;
    }

    public AddEntity(entity: Entity) {
        this._entities.push(entity);
        this._entity_scene.add(entity.Mesh());
    }

    public Size(): Coordinate {
        return this._plane_size;
    }

    public CellSize() {
        return 5;
    }

    public GridSize(): Coordinate {
        return {
            x: this.Size().x / this.CellSize(),
            y: 0,
            z: this.Size().z / this.CellSize(),
        };
    }

    public ToGridCoordinate(coordinate: Coordinate): Coordinate {
        let grid_x = Math.floor(
            Math.abs(this.Size().x / 2 + coordinate.x) / this.CellSize(),
        );
        let grid_z = Math.floor(
            Math.abs(this.Size().z / 2 + coordinate.z) / this.CellSize(),
        );
        return { x: grid_x, y: 0, z: grid_z };
    }

    public ToLevelCoordinate(grid_coordinate: Coordinate): Coordinate {
        let coord: Coordinate = { x: 0, y: 0, z: 0 };
        var half_cell_size = this.CellSize() / 2;
        coord.x =
            -this.Size().x / 2 +
            grid_coordinate.x * this.CellSize() +
            half_cell_size;
        coord.z =
            -this.Size().z / 2 +
            grid_coordinate.z * this.CellSize() +
            half_cell_size;
        return coord;
    }

    get entities(): Entity[] {
        return this._entities;
    }

    get entityScene(): Scene {
        return this._entity_scene;
    }
}
