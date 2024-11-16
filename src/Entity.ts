import ASSETS from "@src/AssetLoader"
import { Stats } from "@src/Stats";
import { Coordinate } from "./levels/Level";
import { Component } from "@src/components/Component";
import { SpriteComponent } from "@src/components/SpriteComponent";

class Action
{
    protected m_id: string;
    protected m_callback: Function;
    protected m_completed: boolean;
    constructor(id: string, callback?: Function)
    {
        this.m_id = id;
        this.m_callback = callback;
        this.m_completed = false;
    }

    public playOnce() {}
    public stop() {}

    get id() { return this.m_id; }
    get callback() { return this.m_callback; }
    get completed() { return this.m_completed; }
    set completed(is_completed: boolean) { this.m_completed = is_completed; }
}

class MovementAction extends Action
{
    protected m_target_position: Coordinate;
    constructor(id: string, target_position: Coordinate, callback?: Function)
    {
        super(id, callback);
        this.m_target_position = target_position;
    }

    get target_position() { return this.m_target_position; }
}

export class Entity
{
    static FPS = 100;
    protected m_three;
    protected m_sprite_mixer;
    protected m_scene;
    protected m_animations;
    protected m_group;
    protected m_action_queue;
    protected m_scale;
    protected m_busy;
    protected m_current_action: Action;
    protected m_mirrored: boolean
    protected m_components: Array<Component> = []

    constructor(three, scene, mirrored: boolean = false)
    {
        this.m_three = three;
        this.m_scene = scene;
        this.m_group = new this.m_three.Group();
        this.m_action_queue = new Array<Action>();
        this.m_action_queue = new Array();
        this.m_scale = {x: 5, y: 5}
        this.m_busy = false;
        this.m_current_action = null;
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
        this.m_scene.add(component.group)
        this.m_components.push(component);
    }

    FindComponent(componentName: string)
    {
        return this.m_components.find((element) => element.name === componentName);
    }

    public Update(delta)
    {
        this.m_components.forEach((component: Component) => {
            component.Update(delta);
        });

        if (this.m_current_action && this.m_current_action instanceof MovementAction)
        {
            let move_action: MovementAction = this.m_current_action as MovementAction;
            let rounded_current_mesh_x = Math.round(this.Mesh().position.x * 10) / 10;
            let rounded_current_mesh_z = Math.round(this.Mesh().position.z * 10) / 10;
            let rounded_target_mesh_x = Math.round(move_action.target_position.x * 10) / 10;
            let rounded_target_mesh_z = Math.round(move_action.target_position.z * 10) / 10;
            if (Math.abs(rounded_current_mesh_x - rounded_target_mesh_x) > 0.2 || 
                Math.abs(rounded_current_mesh_z - rounded_target_mesh_z) > 0.2)
            {
                this.Mesh().position.x += (Math.sign(move_action.target_position.x - this.Mesh().position.x) * 0.15);
                this.Mesh().position.z += (Math.sign(move_action.target_position.z - this.Mesh().position.z) * 0.15);
            }
            else
            {
                move_action.completed = true;
                this.m_busy = false;
            }
        }

        for (let sprite of this.m_group.children)
        {
            if (sprite.visible)
            {
                // console.log(sprite.geometry.boundingBox);
            }
        }
    }

    public Move(target: Coordinate, callback?: Function)
    {
        this.m_action_queue.push(new MovementAction("move", target, callback));
        // if (!this.m_busy)
        // {
        //     this.PlayAction(this.m_action_queue.shift());
        // }
    }


    public Mesh()
    {
        return this.m_group;
    }
}