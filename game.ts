//Pixi.js setup
const renderer = new PIXI.Renderer({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x03d7fc
});

document.body.appendChild(renderer.view);

var stage: PIXI.Container = new PIXI.Container();
var graphics: PIXI.Graphics = new PIXI.Graphics();
stage.addChild(graphics);

const ticker: PIXI.Ticker = new PIXI.Ticker();
ticker.add(animate);
ticker.start();

//Matter.JS setup
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Composite = Matter.Composite,
    Composites = Matter.Composites,
    Constraint = Matter.Constraint,
    Detector = Matter.Detector,
    Mouse = Matter.Mouse;

var engine = Engine.create();
var world = engine.world;

class CandyBall
{
    public x: number;
    public y: number;
    private sprite: PIXI.Sprite;
    private body: Bodies.body;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
        
        this.body = Bodies.circle(x, y, 5);

        const texture = PIXI.Texture.from('images/candyball.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.15;
        this.sprite.scale.y = 0.15;
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }

    Update()
    {
        this.x = this.body.position.x;
        this.y = this.body.position.y

        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    GetSprite()
    {
        return this.sprite;
    }

    GetBody() {
        return this.body;
    }
}

class Star {
    public x: number;
    public y: number;
    private sprite: PIXI.Sprite;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        
        const texture = PIXI.Texture.from('images/star.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.1;
        this.sprite.scale.y = 0.1;
    }

    Update() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    GetSprite() {
        return this.sprite;
    }
}

class Bubble {
    public x: number;
    public y: number;
    private sprite: PIXI.Sprite;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        const texture = PIXI.Texture.from('images/bubble.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.25;
        this.sprite.scale.y = 0.25;
    }

    Update() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    GetSprite() {
        return this.sprite;
    }
}

class Rope {
    public x: number;
    public y: number;
    private composite: Matter.Composite;

    private sprite: PIXI.Sprite;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        var m = Matter.Composites.stack(x, y, 8, 1, 10, 10, function (x, y) {
            return Matter.Bodies.rectangle(x, y, 30, 20);
        });
        
        Matter.Composites.chain(m, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 0.4, render: { type: 'line' } });
        Matter.Composite.add(m, Matter.Constraint.create({
            bodyB: m.bodies[0],
            pointB: { x: -25, y: 0 },
            pointA: { x: m.bodies[0].position.x, y: m.bodies[0].position.y },
            stiffness: 0.5
        }));

        this.composite = m;

        const texture = PIXI.Texture.from('images/support.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.scale.x = 0.25;
        this.sprite.scale.y = 0.25;
    }

    Update() {
        graphics.lineStyle(5, 0x785018, 1);

        this.sprite.x = this.x;
        this.sprite.y = this.y;

        for (i = 0; i < 7; i++) 
        {
            graphics.moveTo(this.composite.bodies[i].position.x, this.composite.bodies[i].position.y);
            graphics.lineTo(this.composite.bodies[i + 1].position.x, this.composite.bodies[i + 1].position.y);
        }
    }

    GetBody() {
        return this.composite;
    }

    GetSprite() {
        return this.sprite;
    }
}

class Constr{
    public main: Matter.Constraint;
    constructor(a: Bodies.body, b: Bodies.body)
    {
        var props = {
            bodyA: a,
            bodyB: b,
            length: 15,
            damping: 0.1
        };

        this.main = Constraint.create(props);
    }
}

class Monster {
    public x: number;
    public y: number;
    private sprite: PIXI.Sprite;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

        const texture = PIXI.Texture.from('images/nomnom.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.75;
        this.sprite.scale.y = 0.75;
    }

    Update() {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    }

    GetSprite() {
        return this.sprite;
    }
}

var ball: CandyBall = new CandyBall(400,300);
World.add(world, ball.GetBody());
stage.addChild(ball.GetSprite());

var star: Star = new Star(700,100);
stage.addChild(star.GetSprite());

var bubble: Bubble = new Bubble(700, 400);
stage.addChild(bubble.GetSprite());

var rope: Rope = new Rope(500,50);
World.add(world, rope.GetBody());
stage.addChild(rope.GetSprite());

var rope2: Rope = new Rope(850, 50);
World.add(world, rope2.GetBody());
stage.addChild(rope2.GetSprite());

var nomnom: Monster = new Monster(675, 700);
stage.addChild(nomnom.GetSprite());

Engine.run(engine);

var con1: Constr = new Constr(rope.GetBody().bodies[7], ball.GetBody());
World.add(world, con1.main);

var con2: Constr = new Constr(rope2.GetBody().bodies[7], ball.GetBody());
World.add(world, con2.main);

//List of all objects
let objList: (CandyBall | Star | Rope | Rope | Monster | Bubble)[] = [ball, star, rope, rope2, nomnom, bubble]; 

function animate()
{
    graphics.clear();

    for(var i = 0; i < objList.length; i++)
    {
       objList[i].Update();
    }

    console.log(rope2.x);

    renderer.render(stage);
}