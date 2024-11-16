import ASSETS from "@src/AssetLoader"
import { Mesh } from "three";

export interface Coordinate
{
    x: number;
    y: number;
    z: number;
}

export class Level 
{
    private m_three: any;
    private m_material: any;
    private m_plane_size: {x: number, y: number, z: number};
    private m_geometry: any;
    private m_cube: Mesh;

    constructor(three)
    {
        this.m_three = three;
        const texture = new this.m_three.TextureLoader().load(ASSETS.GRASS);

        this.m_plane_size = {x: 10, y: 0, z: 15};
        this.m_material = new this.m_three.MeshBasicMaterial(
            { 
                map: texture
            }
        );
        this.m_geometry = new this.m_three.BoxGeometry(
            this.m_plane_size.x, this.m_plane_size.y, this.m_plane_size.z);
        this.m_cube = new this.m_three.Mesh(this.m_geometry, this.m_material);
        this.m_cube.name = "level";
    }

    public Mesh(): Mesh
    {
        return this.m_cube;
    }

    public Size(): Coordinate
    {
        return this.m_plane_size;
    }

    public CellSize()
    {
        return 5;
    }

    public GridSize(): Coordinate
    {
        return {x: this.Size().x / this.CellSize(), y: 0, z: this.Size().z / this.CellSize()};
    }

    public ToGridCoordinate(coordinate: Coordinate): Coordinate
    {
        let grid_x = Math.floor(Math.abs((this.Size().x / 2) + coordinate.x) / this.CellSize());
        let grid_z = Math.floor(Math.abs((this.Size().z / 2) + coordinate.z) / this.CellSize());
        return {x: grid_x, y: 0, z: grid_z};
    }

    public ToLevelCoordinate(grid_coordinate: Coordinate): Coordinate
    {
        let coord: Coordinate = {x: 0, y: 0, z: 0};
        var half_cell_size = this.CellSize() / 2;
        coord.x = (-this.Size().x / 2) + (grid_coordinate.x * this.CellSize()) + half_cell_size;
        coord.z = (-this.Size().z / 2) + (grid_coordinate.z * this.CellSize()) + half_cell_size;
        return coord;
    }
}