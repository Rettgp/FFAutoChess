import ASSETS from "@src/AssetLoader"

export class Coordinate
{
    private m_x: number;
    private m_y: number;
    private m_z: number;
    constructor(x: number = 0, y: number = 0, z: number = 0)
    {
        this.m_x = x;
        this.m_y = y;
        this.m_z = z;
    }

    get x() { return this.m_x; }
    set x(x: number) { this.m_x = x; }
    get y() { return this.m_y; }
    set y(y: number) { this.m_y = y; }
    get z() { return this.m_z; }
    set z(z: number) { this.m_z = z; }
}

export class Level 
{
    private m_three: any;
    private m_material: any;
    private m_plane_size: {x: number, y: number, z: number};
    private m_geometry: any;
    private m_cube: any;

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

    public Mesh()
    {
        return this.m_cube;
    }

    public Size()
    {
        return this.m_plane_size;
    }

    public CellSize()
    {
        return 5;
    }

    public GridSize()
    {
        return {x: this.Size().x / this.CellSize(), z: this.Size().z / this.CellSize()};
    }

    public ToGridCoordinate(coordinate: Coordinate): Coordinate
    {
        let grid_x = Math.floor(Math.abs((this.Size().x / 2) + coordinate.x) / this.CellSize());
        let grid_z = Math.floor(Math.abs((this.Size().z / 2) + coordinate.z) / this.CellSize());
        return new Coordinate(grid_x, 0, grid_z);
    }

    public ToLevelCoordinate(grid_coordinate: Coordinate): Coordinate
    {
        let coord: Coordinate = new Coordinate();
        var half_cell_size = this.CellSize() / 2;
        coord.x = (-this.Size().x / 2) + (grid_coordinate.x * this.CellSize()) + half_cell_size;
        coord.z = (-this.Size().z / 2) + (grid_coordinate.z * this.CellSize()) + half_cell_size;
        return coord;
    }
}