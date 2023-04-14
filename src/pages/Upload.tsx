import { IonBackButton, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonRow, IonSelect, IonSelectOption, IonTextarea, IonTitle, IonToast, IonToolbar, NavContext } from '@ionic/react';
import { caretBack } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useHistory } from 'react-router';
import axios from 'axios';
import * as xlsx from 'xlsx';

import UserContext from '../data/user-context';

import './Upload.css';

const Upload: React.FC = () => {
  const userCtx = useContext(UserContext);
  const history = useHistory();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const redirect404 = useCallback(
		() => navigate('/404'),
		[navigate]
	);

  const [toastMessage, setToastMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [players, setPlayers] = useState("");
  const [language, setLanguage] = useState("1");
  const [items, setItems] = useState("10");
  const [dataTextInput, setDataTextInput] = useState("");
  const [dataJson, setDataJson] = useState<Array<any>>([]);

	useEffect(() => {
		if(userCtx.user.length === 0) {
      redirect();
    }
    else {
      if(userCtx.user[0].uid != -1) {
        const formData = new FormData();

        formData.append('uid', userCtx.user[0].uid.toString());

        axios.post("http://localhost/PickMent/getProfile.php", formData).then(res => {
          if(res.data.profile[0].status === "0") {
            redirect404();
          }
        });
      }
    }
	}, [userCtx]);

  const compareWith = (o1: any, o2: any) => {
    return o1 && o2 ? o1 === o2 : o1 === o2;
  };

  const readUploadFile = (e: any) => {
    e.preventDefault();
    
    if(e.target.files) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        setDataJson(json);
      };

      if(e.target.files[0]) {
        reader.readAsArrayBuffer(e.target.files[0]);
      }
      else {
        setDataJson([]);
      }
    }
  }

  const uploadSetHandler = () => {
    if(title === '') {
      return setToastMessage('Judul tidak boleh kosong.');
    }
    else {
      if(!/^[ -~]*$/.test(title)) {
        return setToastMessage('Judul mengandung karakter yang tidak diizinkan.');
      }
    }

    if(players === '') {
      return setToastMessage('Kuota Pemain tidak boleh kosong.');
    }
    else {
      if(!/^[0-9]*$/.test(players)) {
        return setToastMessage('Kuota Pemain harus merupakan bilangan bulat.');
      }
      else {
        if(parseInt(players) <= 0) {
          return setToastMessage('Kuota Pemain harus lebih dari nol.');
        }
      }
    }

    const dataTmp = [];

    for(var i = 0; i < dataJson.length; i++) {
      for(var j = 0; j < dataJson[i].length; j++) {
        if(dataJson[i][j] !== "") {
          dataTmp.push(dataJson[i][j]);
        }
      }
    }

    const dataTextInputTmp = dataTextInput.split("\n");
    for(var i = 0; i < dataTextInputTmp.length; i++) {
      if(dataTextInputTmp[i] !== "") {
        dataTmp.push(dataTextInputTmp[i]);
      }
    }

    if(dataTmp.length === 0) {
      return setToastMessage('Data tidak boleh kosong.');
    }
    else {
      if((dataTmp.length < parseInt(items)) || (dataTmp.length % parseInt(items) !== 0)) {
        const messageTmp = 
          "Data harus terdiri dari minimal " +
          items +
          " baris data (Jumlah Item per Set) dan merupakan kelipatan dari " +
          items +
          " (Jumlah Item per Set). Harap menambahkan " +
          (parseInt(items) - (dataTmp.length % parseInt(items))).toString() +
          " baris data lagi. Jumlah data sementara adalah " +
          dataTmp.length +
          " baris data."
        ;

        setErrorMessage(messageTmp);

        return setToastMessage(messageTmp);
      }
    }

    const formData = new FormData();

    formData.append('uid', userCtx.user[0].uid.toString());
    formData.append('title', title);
    formData.append('players', players);
    formData.append('language', language);
    formData.append('items', items);
    formData.append('dataRows', JSON.stringify(dataTmp));

    axios.post("http://localhost/PickMent/addDataSet.php", formData).then(res => {
      if(res.data.success === 1) {
        history.replace('/profile');
      }
      else {
        setToastMessage(res.data.message);
      }
    });
	}

  const resetInputHandler = () => {
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setErrorMessage("");

    setTitle("");
    setPlayers("");
    setLanguage("1");
    setItems("10");
    setDataTextInput("");
    setDataJson([]);
	}

  return (
    <IonPage>
      <IonToast
				isOpen={!!toastMessage}
				message={toastMessage}
				duration={2000}
				onDidDismiss={() => { setToastMessage(''); }}
			/>

      <IonHeader>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='profile' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow class='ion-padding ion-text-center'>
            <IonCol>
              <h2 className='font-fredoka-one text-color-primary'>UNGGAH SET</h2>
            </IonCol>
          </IonRow>

          <IonRow class='upload-form-row ion-padding margin-lr-auto'>
            <IonItem lines='none' class='upload-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Judul</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Judul' type='text' value={title} onIonChange={(e: any) => setTitle(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='upload-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Kuota Pemain</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonInput placeholder='Kuota pemain' type='text' value={players} onIonChange={(e: any) => setPlayers(e.target.value)}/>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='upload-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Bahasa</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonSelect 
                  interfaceOptions={{
                    header: 'Preferensi Bahasa'
                  }}
                  class='select-primary'
                  value={language}
                  compareWith={compareWith}
                  onIonChange={(e: any) => setLanguage(e.detail.value)}
                >
                  <IonSelectOption value='0'>Indonesia - Inggris</IonSelectOption>
                  <IonSelectOption value='1'>Indonesia</IonSelectOption>
                  <IonSelectOption value='2'>Inggris</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='upload-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Jumlah Item per Set</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <IonSelect 
                  interfaceOptions={{
                    header: 'Jumlah Item per Set'
                  }}
                  class='select-primary'
                  value={items}
                  compareWith={compareWith}
                  onIonChange={(e: any) => setItems(e.detail.value)}
                >
                  <IonSelectOption value='10'>10 item</IonSelectOption>
                  <IonSelectOption value='15'>15 item</IonSelectOption>
                  <IonSelectOption value='20'>20 item</IonSelectOption>
                </IonSelect>
              </IonItem>
            </IonItem>

            <IonItem lines='none' class='upload-form-item'>
              <IonLabel position='stacked' class='input-label-primary'>Data</IonLabel>
              <IonItem lines='none' class='input-primary'>
                <input ref={fileInputRef} type="file" onChange={(e: any) => readUploadFile(e)}/>
              </IonItem>
              <IonItem lines='none' class='input-primary'>
                <IonTextarea
                  placeholder='Daftar frasa/klausa/kalimat yang hendak diberi label sentimen, masing-masing dipisah dengan baris baru'
                  value={dataTextInput}
                  rows={5}
                  onIonChange={(e: any) => setDataTextInput(e.target.value)}
                />
              </IonItem>
              <small className='upload-form-warning-text'>{errorMessage}</small>
            </IonItem>
          </IonRow>

          <IonRow class='upload-buttons-row ion-padding margin-lr-auto'>
            <IonCol size='auto'>
              <IonButton class='button-shorter-primary' onClick={uploadSetHandler}>Simpan</IonButton>
            </IonCol>

            <IonCol size='auto'>
              <IonButton class='button-shorter-primary-outline' onClick={resetInputHandler}>Reset</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Upload;
