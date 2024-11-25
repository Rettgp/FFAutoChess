import { Entity } from '@src/entities/Entity';
import { ControllerComponent } from '@src/components/ControllerComponent';
import { Level } from '@src/levels/Level';

export class AiControllerComponent extends ControllerComponent {
    private _enemyTarget: Entity = undefined;
    private _team: number = 0;

    constructor(team: number) {
        super();
        this._team = team;
    }

    Update(level: Level, delta: number) {
        super.Update(level, delta);

        let enemyEntities = level.entities.filter(entity => {
            const ai = entity.FindComponent(
                'aicontroller',
            ) as AiControllerComponent;
            return ai && ai.team !== this._team;
        });

        enemyEntities.forEach(entity => {
            this.enemyTarget = entity;
        });

        let controller = this._enemyTarget.FindComponent(
            'controller',
        ) as ControllerComponent;
        if (controller) {
            this.targetGridPosition = {
                x:
                    controller.gridPosition.x +
                    (this._enemyTarget.mirrored ? 1 : -1),
                y: controller.gridPosition.y,
                z:
                    controller.gridPosition.z +
                    (this._enemyTarget.mirrored ? -1 : 1),
            };
        }
    }

    get name(): string {
        return 'controller&aicontroller';
    }
    get team(): number {
        return this._team;
    }
    get enemyTarget(): Entity {
        return this._enemyTarget;
    }
    set enemyTarget(target: Entity) {
        this._enemyTarget = target;
    }
}
