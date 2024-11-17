import { Coordinate, Level } from "./levels/Level";
import { Component } from "@src/components/Component";
import { Group } from "three";


export class Entity
{
    static FPS = 100;
    protected m_three;
    protected m_scene;
    protected m_group;
    protected m_scale;
    protected m_mirrored: boolean;
    protected m_components: Array<Component> = [];
    protected m_target_position: Coordinate = {x: 0, y: 0, z: 0};

    constructor(three, scene, mirrored: boolean = false)
    {
        this.m_three = three;
        this.m_scene = scene;
        this.m_group = new this.m_three.Group();
        this.m_scale = {x: 5, y: 5}
        this.m_mirrored = mirrored;
        this.m_group.name = "entity";
        this.m_group.entity = this;

        let health_texture = new this.m_three.SpriteMaterial({
            color:0xffffff});

        let health_sprite = new this.m_three.Sprite(health_texture);
        health_sprite.scale.x = 3;
        health_sprite.scale.y = 0.5;
        health_sprite.renderOrder = 2
        health_sprite.translateY( 3 );
        this.m_group.add(health_sprite);

        let health_bar_texture = new this.m_three.SpriteMaterial({
            color:0x43A047});

        let health_bar_sprite = new this.m_three.Sprite(health_bar_texture);
        health_bar_sprite.scale.x = 2.9;
        health_bar_sprite.scale.y = 0.16;
        health_bar_sprite.renderOrder = 2
        health_bar_sprite.translateY( 3.14 );
        health_bar_sprite.translateX( -0.03 );
        this.m_group.add(health_bar_sprite);
    }

    get mirrored() { return this.m_mirrored; }

    AddComponent(component: Component)
    {
        if (component.Mesh())
        {
            this.Mesh().add(component.Mesh())
        }
        this.m_components.push(component);
    }

    FindComponent(componentName: string)
    {
        return this.m_components.find((element) => element.name === componentName);
    }

    public Update(level: Level, delta: number)
    {
        this.m_components.forEach((component: Component) => {
            component.Update(delta);
        });

        let mesh: Group | undefined = this.Mesh()
        if (mesh)
        {
            let grid_target = level.ToLevelCoordinate(this.m_target_position);
            let rounded_current_mesh_x = Math.round(mesh.position.x * 10) / 10;
            let rounded_current_mesh_z = Math.round(mesh.position.z * 10) / 10;
            let rounded_target_mesh_x = Math.round(grid_target.x * 10) / 10;
            let rounded_target_mesh_z = Math.round(grid_target.z * 10) / 10;
            if (Math.abs(rounded_current_mesh_x - rounded_target_mesh_x) > 0.2 || 
                Math.abs(rounded_current_mesh_z - rounded_target_mesh_z) > 0.2)
            {
                mesh.position.x += (Math.sign(grid_target.x - mesh.position.x) * 0.15);
                mesh.position.z += (Math.sign(grid_target.z - mesh.position.z) * 0.15);
            }
        }
    }

    public Move(grid_target: Coordinate, callback?: Function)
    {
        this.m_target_position = grid_target;
    }


    public Mesh()
    {
        return this.m_group;
    }
}