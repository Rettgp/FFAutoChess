import { Group } from 'three';

export interface Component {
    name: string;
    components: Array<Component>;
    Update(delta: number);
    Mesh(): Group | undefined;
}
