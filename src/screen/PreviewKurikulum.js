import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ToastAndroid,
  Modal,
  Alert,
} from 'react-native';
import Navbar from '../components/Navbar';
import {Picker} from '@react-native-community/picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';
import Spinner from 'react-native-spinkit';
import {connect} from 'react-redux';

const options = {
  title: 'Select Avatar',
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class PreviewKurikulum extends React.Component {
  state = {
    avatarSource: {
      uri: `http://www.api.pondokprogrammer.com/img/kurikulum/${
        this.props.route.params.img
      }`,
    },
    fileName: '',
    fileSize: '',
    type: '',
    uri: '',
    framework: this.props.route.params.framework,
    jumlahSprint: `${this.props.route.params.sprint}`,
    picker: '0',
    deskripsi: this.props.route.params.description,
    modalVisible: false,
  };

  pickerImage = () => {
    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = {uri: response.uri};
        const fileName = response.fileName;
        const type = response.type;
        const uri = response.uri;
        const fileSize = response.fileSize;

        this.setState({
          avatarSource: source,
          fileName: fileName,
          type: type,
          uri: uri,
          fileSize: fileSize,
        });
      }
    });
  };
  updateData = (divisi, framework, sprint, desc, photo) => {
    if (
      divisi != '0' &&
      framework != '' &&
      sprint != '' &&
      desc != '' &&
      photo != ''
    ) {
      const data = this.props.authentication;
      const token = data.token;
      let id = this.props.route.params.id;

      let image = {
        uri: this.state.uri,
        type: this.state.type,
        name: this.state.fileName,
      };

      const formData = new FormData();

      formData.append('divisi', divisi);
      formData.append('framework', framework);
      formData.append('sprint', sprint);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('_method', 'PUT');

      console.log(formData);

      if (this.state.fileSize >= 1500000) {
        this.setState({modalVisible: false});
        ToastAndroid.show(
          'Foto terlalu besar, maksimal 1,5 MB',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
      } else {
        this.setState({modalVisible: true});

        fetch(`https://api.pondokprogrammer.com/api/kurikulum/${id}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        })
          .then(response => response.json())
          .then(json => {
            if (json.status) {
              this.setState({modalVisible: false});
              console.log(json);
              ToastAndroid.show(
                'Update kurikulum berhasil',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
              this.props.navigation.goBack();
            } else {
              this.setState({modalVisible: false});
              console.log(json);
              ToastAndroid.show(
                'Update kurikulum gagal',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER,
              );
            }
          })
          .catch(error => {
            this.setState({modalVisible: false});
            console.log(error);
            ToastAndroid.show(
              'Network error',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          });
      }
    } else {
      ToastAndroid.show(
        'Tidak boleh ada data yang kosong',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER,
      );
    }
  };
  deleteData = () => {
    const data = this.props.authentication;
    const token = data.token;
    let id = this.props.route.params.id;
    this.setState({modalVisible: true});
    fetch(`http://api.pondokprogrammer.com/api/kurikulum/${id}`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.status) {
          this.setState({modalVisible: false});
          ToastAndroid.show(
            'Kurikulum berhasil dihapus',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
          this.props.navigation.goBack();
        } else {
          this.setState({modalVisible: false});
          ToastAndroid.show(
            'Kurikulum gagal dihapus',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER,
          );
        }
      })
      .catch(er => {
        this.setState({modalVisible: false});
        ToastAndroid.show(
          'Network error',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER,
        );
        console.log(er);
      });
  };
  cautionDelete = () => {
    Alert.alert(
      'Hapus Kurikulum',
      'Apa anda yakin ingin menghapusnya ?',
      [
        {
          text: 'Tidak',
          onPress: () => {
            return false;
          },
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            this.deleteData();
          },
        },
      ],
      {cancelable: false},
    );
  };
  render() {
    const {picker, framework, jumlahSprint, deskripsi, fileName} = this.state;
    return (
      <View style={styles.container}>
        <Navbar name="Preview Kurikulum" />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            ToastAndroid.show(
              'Tunggu proses sampai selesai',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER,
            );
          }}>
          <View style={styles.centeredView}>
            <View style={styles.modalContainer}>
              <Spinner visible={true} type="Wave" color="rgb(0,184,150)" />
              <Text style={styles.textModal}>Loading</Text>
            </View>
          </View>
        </Modal>
        <ScrollView style={styles.scrollview}>
          <View style={styles.boxImagePreview}>
            <Image
              style={styles.imagePreview}
              source={this.state.avatarSource}
            />
          </View>
          <View style={styles.containerButtonCamera}>
            <TouchableOpacity
              delayPressIn={10}
              activeOpacity={0.5}
              style={styles.boxButtonCamera}
              onPress={() => this.pickerImage()}>
              <Icon name="camera" size={20} color="white" />
            </TouchableOpacity>
          </View>
          <View style={styles.containerForm}>
            <View style={styles.boxForm}>
              <Picker
                selectedValue={this.state.picker}
                style={styles.picker}
                mode="dropdown"
                prompt="Options"
                onValueChange={(itemValue, itemIndex) => {
                  if (itemValue != '0') {
                    this.setState({picker: itemValue});
                  }
                }}>
                <Picker.Item
                  label={this.props.route.params.division}
                  value="0"
                  color="grey"
                />
                <Picker.Item label="Backend" value="1" />
                <Picker.Item label="Frontend" value="2" />
                <Picker.Item label="Mobile" value="3" />
              </Picker>
            </View>
          </View>
          <View style={styles.containerForm}>
            <TextInput
              placeholder="Framework"
              value={this.state.framework}
              onChangeText={text => this.setState({framework: text})}
              style={styles.boxForm}
              multiline={true}
            />
          </View>
          <View style={styles.containerForm}>
            <TextInput
              placeholder="Jumlah Sprint"
              value={this.state.jumlahSprint}
              keyboardType="numeric"
              onChangeText={text => this.setState({jumlahSprint: text})}
              style={styles.boxForm}
              multiline={true}
            />
          </View>
          <View style={{...styles.containerForm, height: 170}}>
            <TextInput
              placeholder="Deskripsi Jurusan"
              value={this.state.deskripsi}
              textAlignVertical="top"
              onChangeText={text => this.setState({deskripsi: text})}
              style={{...styles.boxForm, height: 150}}
              multiline={true}
            />
          </View>
          <View style={styles.centeredModalButton}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              delayPressIn={10}
              onPress={() =>
                this.updateData(
                  picker,
                  framework,
                  jumlahSprint,
                  deskripsi,
                  fileName,
                )
              }>
              <Text style={styles.textButton}>Ubah</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.cautionDelete()}
              style={{...styles.button, backgroundColor: 'red'}}
              activeOpacity={0.5}
              delayPressIn={10}>
              <Text style={styles.textButton}>hapus</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.props.navigation.goBack()}
              style={{...styles.button, backgroundColor: 'rgb(0,184,150)'}}
              activeOpacity={0.5}
              delayPressIn={10}>
              <Text style={styles.textButton}>Kembali</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => {
  const {authentication} = state.reducers;
  return {authentication};
};

export default connect(mapStateToProps)(PreviewKurikulum);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollview: {
    flex: 1,
    backgroundColor: 'white',
  },
  button: {
    height: 40,
    width: '30%',
    fontSize: 16,
    borderRadius: 3,
    padding: 10,
    backgroundColor: 'orange',
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textButton: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredModalButton: {
    height: 100,
    width: '100%',
    paddingHorizontal: '10%',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  picker: {
    height: 40,
    width: '100%',
    color: 'grey',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    height: 100,
    width: 100,
    borderRadius: 5,
    elevation: 5,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textModal: {
    color: 'grey',
    marginTop: 5,
  },
  boxImagePreview: {
    height: 150,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  imagePreview: {
    height: 130,
    width: '80%',
    resizeMode: 'contain',
  },
  containerButtonCamera: {
    height: 60,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  boxButtonCamera: {
    height: 40,
    width: '80%',
    borderRadius: 5,
    backgroundColor: 'rgb(0,184,150)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    height: 60,
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  boxForm: {
    height: 40,
    width: '80%',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'rgb(0,184,150)',
    padding: 5,
    justifyContent: 'center',
  },
});
