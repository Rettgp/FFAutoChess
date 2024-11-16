import { Group } from "three";

export interface Component
{
    name: string;
    components: Array<Component>
    group: Group
    Update(delta: number);
}
