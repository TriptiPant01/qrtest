import React, {PureComponent} from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

class ExampleApp extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      camera: false,
      cameraResult: false,
      result: null,
      visionResponse: '',
      loading: false,
      googleVisionDetetion: undefined,
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.back}
          // flashM

          ode={RNCamera.Constants.FlashMode.on}
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel',
          }}
          onGoogleVisionBarcodesDetected={({barcodes}) => {
            console.log(barcodes);
          }}
        />
        <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={this.takePicture.bind(this)}
            style={styles.capture}>
            <Text style={{fontSize: 14}}> SNAP </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  takePicture = async value => {
    if (this.camera) {
      console.log(this.camera);
      const options = {quality: 0.5, base64: true};
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
    }
    // if (value) {
    //   const options = {quality: 0.5, base64: true};
    //   console.log(options);
    //   const data = await value.takePictureAsync(options);
    //   console.log(data);
    //   this.setState(
    //     {
    //       cameraResult: true,
    //       result: data.base64,
    //       camera: false,
    //     },
    //     () => this.callGoogleVIsionApi(this.state.result),
    //   );
    //   this.setState({loading: true});
    // }
  };
  callGoogleVIsionApi = async base64 => {
    let googleVisionRes = await fetch(
      config.googleCloud.api + config.googleCloud.apiKey,
      {
        method: 'POST',
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64,
              },
              features: [{type: 'TEXT_DETECTION', maxResults: 5}],
            },
          ],
        }),
      },
    );

    await googleVisionRes
      .json()
      .then(googleVisionRes => {
        console.log(googleVisionRes);
        if (googleVisionRes) {
          this.setState({
            loading: false,
            googleVisionDetetion: googleVisionRes.responses[0],
          });
          console.log('this.is response', this.state.googleVisionDetetion);
        }
      })
      .catch(error => {
        console.log(error);
      });
    activeCamera = () => {
      this.setState({
        camera: true,
      });
    };
    clickAgain = () => {
      this.setState({
        camera: true,
        googleVisionDetetion: false,
        loading: false,
      });
    };
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default ExampleApp;
