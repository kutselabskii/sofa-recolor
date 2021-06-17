import './App.css';
import * as tf from '@tensorflow/tfjs';
import React, { useRef } from 'react';

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

  computeOutputShape(input_shape) {
    return [input_shape[0], this.w, this.h, input_shape[3]]
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.photoRef = React.createRef();

    this.state = {
      webcam: null
    };
  }

  async componentDidMount() {
    tf.serialization.registerClass(ResizeLayer);
    this.model = await tf.loadLayersModel('fast_scnn_model/model.json');

    this.getVideo();
  }

  getVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(async function(stream) {
        let video = this.videoRef.current;
        video.srcObject = stream;

        video.play();

        let cam = await tf.data.webcam(video, {
                resizeWidth: 196,
                resizeHeight: 196,
        });

        this.setState()
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  predict() {
    
  }

  render() {
    // useEffect(() => {
    //   getVideo();
    // }, [videoRef]);

    const getVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: { width: 300 } })
        .then(stream => {
          let video = this.videoRef.current;
          video.srcObject = stream;
          video.addEventListener('loadeddata', this.predict);
          video.play();
        })
        .catch(err => {
          console.error("error:", err);
        });
    };

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
          <video ref={this.videoRef}/>
        </header>
      </div>
    );
  }
}

export default App;
