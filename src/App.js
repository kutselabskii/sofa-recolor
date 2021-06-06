import './App.css';
import * as tf from '@tensorflow/tfjs';
import React from 'react';

class BatchNorm extends tf.layers.Layer {
  static className = 'BatchNorm';

  // constructor(config) {
	// 	super(config);
	// }

  call(x) {
    return tf.batchNorm(x);
	}

  // static get className() {
	// 	console.log(className);
	//   return className;
	// }
}

class App extends React.Component {
  async componentDidMount() {
    tf.serialization.registerClass(BatchNorm);
    const model = await tf.loadLayersModel('tfjs_model/model.json');
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Sofa Recolor</h1>
          <ol type="1">
            <li>Make photo of sofa using camera</li>
            <li>Select texture to use for recoloring</li>
            <li>Observe results</li>
          </ol>
          <button>Enable camera</button>
        </header>
      </div>
    );
  }
}

export default App;
