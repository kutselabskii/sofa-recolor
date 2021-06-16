import './App.css';
import * as tf from '@tensorflow/tfjs';
import React from 'react';

// class ResizeLayer(tf.keras.layers.Layer):
//     def __init__(self, w, h, name=None, **kwargs):
//         super(ResizeLayer, self).__init__()

//         self.w = w
//         self.h = h

//     def call(self, inputs):
//         return tf.image.resize(inputs, (self.w, self.h))

//     def get_config(self):
//         config = super().get_config().copy()
//         config.update({
//             'w': self.w,
//             'h': self.h,
//         })
//         return config

class ResizeLayer extends tf.layers.Layer {
  static className = 'ResizeLayer';

  constructor(config) {
		super(config);
    this.w = config.w;
    this.h = config.h;
	}

  call(x) {
    return tf.image.resizeBilinear(x, [this.w, this.h]);
	}
}

class App extends React.Component {
  async componentDidMount() {
    tf.serialization.registerClass(ResizeLayer);
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
