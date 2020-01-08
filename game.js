//Pixi.js setup
var canv = document.getElementById("canvas");
canv.width = window.innerWidth;
canv.height = window.innerHeight;
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
var mouseX, mouseY;
function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}
//Matter.JS setup
var Engine = Matter.Engine, World = Matter.World, Bodies = Matter.Bodies, Composite = Matter.Composite, Composites = Matter.Composites, Constraint = Matter.Constraint, Detector = Matter.Detector, Mouse = Matter.Mouse;
var engine = Engine.create();
var world = engine.world;
//Object definities:
var CandyBall = /** @class */ (function () {
    function CandyBall(x, y) {
        this.radius = 40;
        this.bubbled = false;
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
        World.add(world, this.GetBody());
        stage.addChild(this.GetSprite());
    }
    CandyBall.prototype.Update = function () {
        if (circleCollision(this, bubble) && !bubble.popped) {
            bubble.activated = true;
            this.bubbled = true;
        }
        else {
            this.bubbled = false;
        }
        if (circleCollision(this, nomnom)) {
            stage.removeChild(this.GetSprite());
        }
        if (!this.bubbled) {
            this.x = this.body.position.x;
            this.y = this.body.position.y;
        }
        else {
            this.x = bubble.x;
            this.y = bubble.y;
        }
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
        this.radius = 20;
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/star.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.1;
        this.sprite.scale.y = 0.1;
        stage.addChild(this.GetSprite());
    }
    Star.prototype.Update = function () {
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        if (circleCollision(this, ball)) {
            stage.removeChild(this.GetSprite());
        }
    };
    Star.prototype.GetSprite = function () {
        return this.sprite;
    };
    return Star;
}());
var Bubble = /** @class */ (function () {
    function Bubble(x, y) {
        this.radius = 40;
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/bubble.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.25;
        this.sprite.scale.y = 0.25;
        stage.addChild(this.GetSprite());
    }
    Bubble.prototype.Update = function () {
        if (this.activated) {
            this.y -= 1.5;
        }
        if (!this.popped) {
            this.Pop();
        }
        this.sprite.x = this.x;
        this.sprite.y = this.y;
    };
    Bubble.prototype.GetSprite = function () {
        return this.sprite;
    };
    Bubble.prototype.Pop = function () {
        var distanceX = this.x - mouseX;
        var distanceY = this.y - mouseY;
        var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        if (distance <= 40) {
            stage.removeChild(this.GetSprite());
            if (ball.bubbled) {
                World.remove(world, ball.GetBody());
                ball.body = Bodies.circle(this.x, this.y, 5);
                World.add(world, ball.GetBody());
            }
            ball.bubbled = false;
            this.popped = true;
        }
    };
    return Bubble;
}());
var Rope = /** @class */ (function () {
    function Rope(x, y, constraintID) {
        this.x = x;
        this.y = y;
        this.constraintID = constraintID;
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
        World.add(world, this.GetBody());
        stage.addChild(this.GetSprite());
    }
    Rope.prototype.Update = function () {
        if (!this.disabled) {
            graphics.lineStyle(5, 0x785018, 1);
            this.sprite.x = this.x;
            this.sprite.y = this.y;
            for (i = 0; i < 7; i++) {
                graphics.moveTo(this.composite.bodies[i].position.x, this.composite.bodies[i].position.y);
                graphics.lineTo(this.composite.bodies[i + 1].position.x, this.composite.bodies[i + 1].position.y);
            }
            if (this.MouseCollides()) {
                this.disabled = true;
                World.remove(world, this.composite);
                World.remove(world, constrList[this.constraintID].main);
            }
        }
    };
    Rope.prototype.GetBody = function () {
        return this.composite;
    };
    Rope.prototype.GetSprite = function () {
        return this.sprite;
    };
    Rope.prototype.MouseCollides = function () {
        var collides;
        for (var i = 0; i < 8; i++) {
            if (mouseX > (this.composite.bodies[i].position.x - 20) &&
                mouseX < (this.composite.bodies[i].position.x + 20) &&
                mouseY > (this.composite.bodies[i].position.y - 20) &&
                mouseY < (this.composite.bodies[i].position.y + 20)) {
                collides = true;
                console.log('collides');
            }
        }
        return collides;
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
        World.add(world, this.main);
    }
    return Constr;
}());
var Monster = /** @class */ (function () {
    function Monster(x, y) {
        this.radius = 50;
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/nomnom.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.scale.x = 0.75;
        this.sprite.scale.y = 0.75;
        stage.addChild(this.GetSprite());
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
var RopeTrap = /** @class */ (function () {
    function RopeTrap(x, y) {
        this.radius = 150;
        this.x = x;
        this.y = y;
        var texture = PIXI.Texture.from('images/support.png');
        this.sprite = new PIXI.Sprite(texture);
        this.sprite.anchor.x = 0.5;
        this.sprite.anchor.y = 0.5;
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.scale.x = 0.25;
        this.sprite.scale.y = 0.25;
        stage.addChild(this.GetSprite());
    }
    RopeTrap.prototype.Update = function () {
        graphics.lineStyle(5, 0x785018, 1);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        if (circleCollision(this, ball) && !this.activated) {
            this.SpawnRope();
        }
        if (!this.activated) {
            graphics.lineStyle(5, 0xC82033, 1);
            graphics.drawCircle(this.x, this.y, 175);
        }
        if (this.activated) {
            for (i = 0; i < 7; i++) {
                graphics.moveTo(this.composite.bodies[i].position.x, this.composite.bodies[i].position.y);
                graphics.lineTo(this.composite.bodies[i + 1].position.x, this.composite.bodies[i + 1].position.y);
            }
        }
    };
    RopeTrap.prototype.GetBody = function () {
        return this.composite;
    };
    RopeTrap.prototype.GetSprite = function () {
        return this.sprite;
    };
    RopeTrap.prototype.SpawnRope = function () {
        var m = Matter.Composites.stack(this.x, this.y, 8, 1, 10, 10, function (x, y) {
            return Matter.Bodies.rectangle(x, y, 30, 20);
        });
        Matter.Composites.chain(m, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 0.8, render: { type: 'line' } });
        Matter.Composite.add(m, Matter.Constraint.create({
            bodyB: m.bodies[0],
            pointB: { x: -25, y: 0 },
            pointA: { x: m.bodies[0].position.x, y: m.bodies[0].position.y },
            stiffness: 0.5
        }));
        this.composite = m;
        World.add(world, this.GetBody());
        this.activated = true;
        var con = new Constr(ball.GetBody(), this.GetBody().bodies[7]);
        World.add(world, con.main);
    };
    return RopeTrap;
}());
function circleCollision(a, b) {
    var distanceX = a.x - b.x;
    var distanceY = a.y - b.y;
    var distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
    if (a.radius > distance - b.radius) {
        return true;
    }
}
//Object declarations
var ball = new CandyBall(400, 300);
var star = new Star(660, 26);
var bubble = new Bubble(700, 400);
var rope = new Rope(500, 50, 0);
var rope2 = new Rope(850, 50, 1);
var nomnom = new Monster(405, 720);
var trap = new RopeTrap(540, 570);
var con1 = new Constr(rope.GetBody().bodies[7], ball.GetBody());
var con2 = new Constr(rope2.GetBody().bodies[7], ball.GetBody());
Engine.run(engine);
var mouseX, mouseY;
//List of all objects
var objList = [ball, star, rope, rope2, nomnom, bubble, trap];
//List of constraints
var constrList = [con1, con2];
//Handle input
canv.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePos(canv, evt);
    mouseX = mousePos.x;
    mouseY = mousePos.y;
}, false);
function animate() {
    graphics.clear();
    for (var i = 0; i < objList.length; i++) {
        objList[i].Update();
    }
    renderer.render(stage);
}
