//Pixi.js setup
var renderer = new PIXI.Renderer({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x03d7fc
});
document.body.appendChild(renderer.view);
var stage = new PIXI.Container();
var graphics = new PIXI.Graphics();
stage.addChild(graphics);
var ticker = new PIXI.Ticker();
ticker.add(animate);
ticker.start();
//Matter.JS setup
var Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Composite = Matter.Composite, Composites = Matter.Composites, Constraint = Matter.Constraint, Detector = Matter.Detector, Mouse = Matter.Mouse;
var engine = Engine.create();
var world = engine.world;
var CandyBall = /** @class */ (function () {
    function CandyBall(x, y) {
        this.x = x;
        this.y = y;
        this.body = Bodies.circle(x, y, 5);
        var texture = PIXI.Texture.from('images/candyball.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.15;
        this.sprite.scale.y = 0.15;
        this.sprite.x = this.body.position.x;
        this.sprite.y = this.body.position.y;
    }
    CandyBall.prototype.Update = function () {
        this.x = this.body.position.x;
        this.y = this.body.position.y;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };
    CandyBall.prototype.GetSprite = function () {
        return this.sprite;
    };
    CandyBall.prototype.GetBody = function () {
        return this.body;
    };
    return CandyBall;
}());
var Star = /** @class */ (function () {
    function Star(x, y) {
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/star.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.1;
        this.sprite.scale.y = 0.1;
    }
    Star.prototype.Update = function () {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };
    Star.prototype.GetSprite = function () {
        return this.sprite;
    };
    return Star;
}());
var Bubble = /** @class */ (function () {
    function Bubble(x, y) {
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/bubble.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.25;
        this.sprite.scale.y = 0.25;
    }
    Bubble.prototype.Update = function () {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };
    Bubble.prototype.GetSprite = function () {
        return this.sprite;
    };
    return Bubble;
}());
var Rope = /** @class */ (function () {
    function Rope(x, y) {
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
        var texture = PIXI.Texture.from('images/support.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.scale.x = 0.25;
        this.sprite.scale.y = 0.25;
    }
    Rope.prototype.Update = function () {
        graphics.lineStyle(5, 0x785018, 1);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        for (i = 0; i < 7; i++) {
            graphics.moveTo(this.composite.bodies[i].position.x, this.composite.bodies[i].position.y);
            graphics.lineTo(this.composite.bodies[i + 1].position.x, this.composite.bodies[i + 1].position.y);
        }
    };
    Rope.prototype.GetBody = function () {
        return this.composite;
    };
    Rope.prototype.GetSprite = function () {
        return this.sprite;
    };
    return Rope;
}());
var Constr = /** @class */ (function () {
    function Constr(a, b) {
        var props = {
            bodyA: a,
            bodyB: b,
            length: 15,
            damping: 0.1
        };
        this.main = Constraint.create(props);
    }
    return Constr;
}());
var Monster = /** @class */ (function () {
    function Monster(x, y) {
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/nomnom.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.75;
        this.sprite.scale.y = 0.75;
    }
    Monster.prototype.Update = function () {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };
    Monster.prototype.GetSprite = function () {
        return this.sprite;
    };
    return Monster;
}());
var ball = new CandyBall(400, 300);
World.add(world, ball.GetBody());
stage.addChild(ball.GetSprite());
var star = new Star(700, 100);
stage.addChild(star.GetSprite());
var bubble = new Bubble(700, 400);
stage.addChild(bubble.GetSprite());
var rope = new Rope(500, 50);
World.add(world, rope.GetBody());
stage.addChild(rope.GetSprite());
var rope2 = new Rope(850, 50);
World.add(world, rope2.GetBody());
stage.addChild(rope2.GetSprite());
var nomnom = new Monster(675, 700);
stage.addChild(nomnom.GetSprite());
Engine.run(engine);
var con1 = new Constr(rope.GetBody().bodies[7], ball.GetBody());
World.add(world, con1.main);
var con2 = new Constr(rope2.GetBody().bodies[7], ball.GetBody());
World.add(world, con2.main);
//List of all objects
var objList = [ball, star, rope, rope2, nomnom, bubble];
function animate() {
    graphics.clear();
    for (var i = 0; i < objList.length; i++) {
        objList[i].Update();
    }
    console.log(rope2.x);
    renderer.render(stage);
}
