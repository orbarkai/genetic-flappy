class Brain{

    constructor(){
        this.inputNodes = 5;
        this.hiddenNodes = 6;
        this.outputNodes = 1;
        this.input_weights = tf.randomNormal([this.inputNodes, this.hiddenNodes]);
        this.output_weights = tf.randomNormal([this.hiddenNodes, this.outputNodes]);
    }

    predict(input){
        let output;
        tf.tidy(()=>{
            let input_layer = tf.tensor(input, [1, this.inputNodes]);
            let hidden_layer = input_layer.matMul(this.input_weights).sigmoid();
            let output_layer = hidden_layer.matMul(this.output_weights).sigmoid();
            output = output_layer.dataSync();
        });
        return output[0];
    }

    clone(){
        let clonie = new Brain();
        clonie.dispose();
        clonie.input_weights = tf.clone(this.input_weights);
        clonie.output_weights = tf.clone(this.output_weights);
        return clonie;
    }

    dispose(){
        this.input_weights.dispose();
        this.output_weights.dispose();
    }

}