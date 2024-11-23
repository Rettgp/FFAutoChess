import { Component } from '@src/components/Component';
import { Coordinate, Level } from '@src/levels/Level';
import { Entity } from '@src/Entity';
import { Group } from 'three';

export class ControllerComponent implements Component {
    private _components: Component[];
    private _position: Coordinate = { x: 0, y: 0, z: 0 };
    private _gridPosition: Coordinate = { x: 0, y: 0, z: 0 };
    private _targetGridPosition: Coordinate = { x: 0, y: 0, z: 0 };

    constructor() {
        this._components = [];
    }

    Update(level: Level, delta: number) {
        // TODO: Modify to have a controller use a target entity and if there
        // is a target, run to a cell next to it.
        let grid_target = level.ToLevelCoordinate(this.targetGridPosition);
        let rounded_current_mesh_x = Math.round(this.position.x * 10) / 10;
        let rounded_current_mesh_z = Math.round(this.position.z * 10) / 10;
        let rounded_target_mesh_x = Math.round(grid_target.x * 10) / 10;
        let rounded_target_mesh_z = Math.round(grid_target.z * 10) / 10;
        if (
            Math.abs(rounded_current_mesh_x - rounded_target_mesh_x) > 0.2 ||
            Math.abs(rounded_current_mesh_z - rounded_target_mesh_z) > 0.2
        ) {
            this.position.x +=
                Math.sign(grid_target.x - this.position.x) * 0.15;
            this.position.z +=
                Math.sign(grid_target.z - this.position.z) * 0.15;
            this._gridPosition = level.ToGridCoordinate(this._position);
        }
    }

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
    get position(): Coordinate {
        return this._position;
    }
    set position(position: Coordinate) {
        this._position = position;
    }
    get gridPosition(): Coordinate {
        return this._gridPosition;
    }
    get targetGridPosition(): Coordinate {
        return this._targetGridPosition;
    }
    set targetGridPosition(position: Coordinate) {
        this._targetGridPosition = position;
    }
}
