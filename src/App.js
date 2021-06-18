import './App.css';
import * as tf from '@tensorflow/tfjs';
import React, { useRef } from 'react';

class ResizeLayer extends tf.layers.Layer {
  constructor(config) {
		super(config);
    this.w = config.w;
    this.h = config.h;
	}

  call(input) {
    return tf.tidy(() => {
      return tf.image.resizeBilinear(input[0], [this.w, this.h]);
    });
	}

  computeOutputShape(input_shape) {
    return [input_shape[0], this.w, this.h, input_shape[3]]
  }

  static get className() {
    return 'ResizeLayer';
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.videoRef = React.createRef();
    this.photoRef = React.createRef();

    this.getVideo = this.getVideo.bind(this);

    this.state = {
      webcam: null
    };
  }

  async componentDidMount() {
    tf.serialization.registerClass(ResizeLayer);
    this.model = await tf.loadLayersModel('fast_scnn_model/model.json');
    // console.log(this.model.summary());

    this.getVideo();
  }

  getVideo() {
    navigator.mediaDevices
      .getUserMedia({ video: { width: 300 } })
      .then(async stream => {
        let video = this.videoRef.current;
        video.srcObject = stream;

        video.play();

        let cam = await tf.data.webcam(video, {
                resizeWidth: 256,
                resizeHeight: 512,
        });

        this.setState({webcam: cam});
      })
      .catch(err => {
        console.error("error:", err);
      });
  }

  async predict() {
    let video = this.videoRef.current;
    let photo = this.photoRef.current;
    let ctx = photo.getContext("2d");

    if (this.state.webcam == null) {
      return;
    }

    let img = await this.state.webcam.capture();
    img = img.reshape([1, 512, 256, 3]);

    const res = this.model.predict(img);
    console.log(res[0]);

    const width = 256;
    const height = 512;
    photo.width = width;
    photo.height = height;

    return setInterval(() => {
      ctx.drawImage(video, 0, 0, width, height);
    }, 100);
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
          <video onCanPlay={() => this.predict()} ref={this.videoRef}/>
          <canvas ref={this.photoRef} />
        </header>
      </div>
    );
  }
}

export default App;
