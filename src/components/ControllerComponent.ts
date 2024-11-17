import { Component } from '@src/components/Component';
import { Group } from 'three';

export class ControllerComponent implements Component {
    private _components: Component[];

    constructor(max: number) {
        this._components = [];
    }

    Update(delta: number) {}

    Mesh(): Group | undefined {
        return undefined;
    }

    OnKeyPressed(e: any) {
        //     if (!this.m_selected_entity) {
        //         return;
        //     }
        //     let defender_mesh = this.m_enemy_selected.Mesh();
        //     let attacker_mesh = this.m_selected_entity.Mesh();
        //     let previous_position = {
        //         x: attacker_mesh.position.x,
        //         y: attacker_mesh.position.y,
        //         z: attacker_mesh.position.z,
        //     };
        //     let target_position = {
        //         x: defender_mesh.position.x,
        //         y: 0,
        //         z: defender_mesh.position.z,
        //     };
        //     target_position.x += this.m_enemy_selected.mirrored
        //         ? this.m_level.CellSize()
        //         : -this.m_level.CellSize();
        //     target_position.z += this.m_enemy_selected.mirrored
        //         ? -this.m_level.CellSize()
        //         : this.m_level.CellSize();
        //     this.m_selected_entity.Move(target_position);
        //     switch (e.code) {
        //         case 'Space':
        //             // TODO FIX
        //             // this.m_selected_entity.QueueAnimation("attack", ()=>{
        //             //     this.m_selected_entity.Move(previous_position);
        //             // });
        //             let attack = new MeleeAttack(1, Element.None);
        //             let calc = new Calculations();
        //             calc.ApplyDamage(
        //                 attack,
        //                 this.m_selected_entity,
        //                 this.m_enemy_selected,
        //             );
        //             break;
        //         case 'ControlLeft':
        //             // TODO FIX
        //             // this.m_selected_entity.QueueAnimation("limit_break", ()=>{});
        //             break;
        //     }
    }

    get name(): string {
        return 'controller';
    }
    get components(): Component[] {
        return this._components;
    }
}
