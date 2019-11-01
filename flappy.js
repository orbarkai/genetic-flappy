class Bird{

    constructor(){
        this.pos = createVector(550, random(height));
        this.vel = createVector(0, 0);
        this.r = 17;
        this.power = 8;

        this.score = 0;
        this.passed = 0;
        this.fitness = 0;
        this.alive = true;

        this.clr = color('hsl('+floor(random(361))+', 100%, 50%)');
        this.brain = new Brain();
    }

    update(poles){
        if(this.alive){

            this.tryJump(this.closest(poles));

            this.vel.y+=0.3;
            this.pos.add(this.vel);

            if(this.collide(poles)){
                this.alive = false;
            }

            this.score += 0.01;
        }
    }

    show(){
        strokeWeight(3);
        if(this.alive){
            stroke(this.clr);
            fill(this.clr.levels[0], this.clr.levels[1], this.clr.levels[2], 100);
            ellipse(this.pos.x, this.pos.y, this.r*2);
        }
    }

    jump(){
        this.vel.y=-this.power;
    }

    collide(poles){

        if(this.pos.y+this.r>=height) return true;
        if(this.pos.y-this.r<=0) return true;

        for(let pole of poles){
            if(this.pos.x+this.r>=pole.x && this.pos.x-this.r<=pole.x+pole.width){
                if(this.pos.y-this.r<=pole.top || this.pos.y+this.r>=pole.bottom) return true;
            }
        }
        return false;
    }

    tryJump(closest){

        let inputs = [];
        inputs[0] = this.vel.y / 20;
        inputs[1] = this.pos.y / height;
        inputs[2] = closest.top / height;
        inputs[3] = closest.bottom / height;
        inputs[4] = closest.x / width;

        if(this.brain.predict([inputs])>0.5) this.jump();
    }

    closest(poles){
        for(let pole of poles){
            if(!pole.passed) return pole;
        }
        return null;
    }

    clone(){
        let c = new Bird();
        c.brain = this.brain.clone();
        c.clr = this.clr;
        return c;
    }

    //genetics
    crossOver(other){
        let my_input = this.brain.input_weights.dataSync();
        let my_output = this.brain.output_weights.dataSync();
        let other_input = other.brain.input_weights.dataSync();
        let other_output = other.brain.output_weights.dataSync();

        let child_input = [];
        let child_output = [];

        for(let i=0; i<my_input.length; i++){
            if(random()>0.5) child_input.push(my_input[i]);
            else child_input.push(other_input[i]);
        }
        for(let i=0; i<my_output.length; i++){
            if(random()>0.5) child_output.push(my_output[i]);
            else child_output.push(other_output[i]);
        }

        let child = this.clone();

		let input_shape = this.brain.input_weights.shape;
        let output_shape = this.brain.output_weights.shape;
        
        child.brain.dispose();

        child.brain.input_weights = tf.tensor(child_input, input_shape);
        child.brain.output_weights = tf.tensor(child_output, output_shape);

        let child_clr = [];
        for(let i=0; i<3; i++){
            child_clr.push((this.clr.levels[i]+other.clr.levels[i])/2);
        }
        child.clr = color(child_clr[0], child_clr[1], child_clr[2]);
        
        return child;
    }

    mutate(mr){
        function fn(x) {
			if (random(1) < mr) {
				let offset = randomGaussian() * 0.55;
                let newx = x + offset;
				return newx;
			}
			return x;
		}

		let ih = this.brain.input_weights.dataSync().map(fn);
		let ih_shape = this.brain.input_weights.shape;
		this.brain.input_weights.dispose();
		this.brain.input_weights = tf.tensor(ih, ih_shape);
		
		let ho = this.brain.output_weights.dataSync().map(fn);
		let ho_shape = this.brain.output_weights.shape;
		this.brain.output_weights.dispose();
        this.brain.output_weights = tf.tensor(ho, ho_shape);
        
        this.clr.levels[floor(random(3))] += random(-50, 50);
    }

}

class Pole{

    constructor(margin, width_, speed_){
        this.x = width;
        this.top = random(height-margin);
        this.bottom = this.top + margin;
        this.width = width_;
        this.speed = speed_;
        this.passed = false;
    }

    update(){
        this.speed = 3;
        this.x-=this.speed;
    }

    show(){
        noStroke();
        fill(0, 255, 100);
        rect(this.x, 0,this.width, this.top);
        rect(this.x, this.bottom, this.width, height);
    }

}