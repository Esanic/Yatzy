export class Die {
    public die: number;
    public side: number;
    public selected: boolean;

    constructor(die: number, side: number, selected: boolean){
        this.die = die;
        this.side = side;
        this.selected = selected;
    }
}
