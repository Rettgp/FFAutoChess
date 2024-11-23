import { Coordinate, Level } from './levels/Level';
import { Component } from '@src/components/Component';
import { ControllerComponent } from '@src/components/ControllerComponent';
import { Group } from 'three';

export class Entity {
    protected m_three;
    protected m_group;
    protected m_scale;
    protected m_mirrored: boolean;
    protected m_components: Array<Component> = [];

    constructor(three, mirrored: boolean = false) {
        this.m_three = three;
        this.m_group = new this.m_three.Group();
        this.m_scale = { x: 5, y: 5 };
        this.m_mirrored = mirrored;
        this.m_group.name = 'entity';
        // TODO: This is messing around with propeties to get the Entity, FIX IT
        this.m_group.entity = this;

        let health_texture = new this.m_three.SpriteMaterial({
            color: 0xffffff,
        });

        let health_sprite = new this.m_three.Sprite(health_texture);
        health_sprite.scale.x = 3;
        health_sprite.scale.y = 0.5;
        health_sprite.renderOrder = 2;
        health_sprite.translateY(3);
        this.m_group.add(health_sprite);

        let health_bar_texture = new this.m_three.SpriteMaterial({
            color: 0x43a047,
        });

        let health_bar_sprite = new this.m_three.Sprite(health_bar_texture);
        health_bar_sprite.scale.x = 2.9;
        health_bar_sprite.scale.y = 0.16;
        health_bar_sprite.renderOrder = 2;
        health_bar_sprite.translateY(3.14);
        health_bar_sprite.translateX(-0.03);
        this.m_group.add(health_bar_sprite);
    }

    get mirrored() {
        return this.m_mirrored;
    }

    AddComponent(component: Component) {
        if (component.Mesh()) {
            this.Mesh().add(component.Mesh());
        }
        this.m_components.push(component);
    }

    FindComponent(componentName: string): Component | undefined {
        return this.m_components.find(element =>
            element.name.includes(componentName),
        );
    }

    public Update(level: Level, delta: number) {
        this.m_components.forEach((component: Component) => {
            component.Update(level, delta);
        });

        let mesh: Group | undefined = this.Mesh();
        let controller: ControllerComponent | undefined = this.FindComponent(
            'controller',
        ) as ControllerComponent;
        if (mesh) {
            mesh.position.x = controller?.position.x;
            mesh.position.z = controller?.position.z;
        }
    }

    public Mesh() {
        return this.m_group;
    }
}
