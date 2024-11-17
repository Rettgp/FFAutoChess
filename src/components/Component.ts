import { Group } from 'three';
import { Level } from '@src/levels/Level';

export interface Component {
    name: string;
    components: Array<Component>;
    Update(level: Level, delta: number);
    Mesh(): Group | undefined;
}
