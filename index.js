require('@tensorflow/tfjs-node')
require('async')

const wf = require('wavefile')
const tf = require('@tensorflow/tfjs')
const fs = require('fs')

const json_file = fs.readFileSync('python/config.json', 'utf8');
const config = JSON.parse(json_file);

const MODEL_PATH = 'file://' + config.config.output.output_dir + 'tensorflowjs_model.pb';
const WEIGHTS_PATH = 'file://' + config.config.output.output_dir + 'weights_manifest.json';

const TEST_PATH = 'data/training-f/f0001.wav';

console.log("Loading model from " + MODEL_PATH);
console.log("Loading weights from " + WEIGHTS_PATH);

async function predict_preloadmodel() {
    let x = new wf(fs.readFileSync(TEST_PATH));
    console.log(x['length'])
    for (var member in x) delete x[member];
    x['input/X'] = '1';
    x['input/drop'] = '2';
    const model = await tf.loadFrozenModel(MODEL_PATH, WEIGHTS_PATH);
    await model.predict(x).print();
}

predict_preloadmodel();