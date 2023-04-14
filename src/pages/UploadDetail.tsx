import { IonBackButton, IonButtons, IonCol, IonContent, IonFab, IonFabButton, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonTitle, IonToolbar, NavContext } from '@ionic/react';
import { caretBack, downloadOutline } from 'ionicons/icons';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { DownloadTableExcel } from 'react-export-table-to-excel';

import UserContext from '../data/user-context';

import './UploadDetail.css';

const UploadDetail: React.FC = () => {
  const userCtx = useContext(UserContext);
  const { id } = useParams<{ id: string }>();

  const { navigate } = useContext(NavContext);

  const redirect = useCallback(
		() => navigate('/welcome'),
		[navigate]
	);

  const redirect404 = useCallback(
		() => navigate('/404'),
		[navigate]
	);

  const [title, setTitle] = useState("title");
  const [time, setTime] = useState("DD-MM-YYYY HH:mm");

  const tableRef = useRef(null);

  const [dataTable, setDataTable] = useState<Array<any>>([]);

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

  useEffect(() => {
		if(!/^[0-9]*$/.test(id)) {
      redirect404();
    }
    else {
      const formData = new FormData();

      formData.append('id', id);

      axios.post("http://localhost/PickMent/getDataTable.php", formData).then(res => {
        if(res.data.found === 0) {
          redirect404();
        }
        else {
          setTitle(res.data.title);
          setTime(moment(res.data.time, 'YYYY-MM-DD hh:mm:ss').format("DD-MM-YYYY HH:mm"));

          setDataTable(res.data.dataTable);
        }
      });
    }
	}, [id]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar class='toolbar-color-secondary'>
          <IonButtons slot='start'>
            <IonBackButton defaultHref='/uploaded' icon={caretBack}/>
          </IonButtons>

          <IonTitle slot='end' class='font-fredoka-one'>
            P I C K M E N T
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          <IonRow class='ion-padding ion-text-center'>
            <IonCol className='text-color-primary'>
              <h2 className='ion-no-margin ion-text-uppercase font-fredoka-one'>{title}</h2>
              <small>#{id.padStart(6, '0')} | {time}</small>
            </IonCol>
          </IonRow>

          <IonRow class='detail-row ion-padding margin-lr-auto text-color-secondary'>
            <table className='detail-table' ref={tableRef}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Data</th>
                  <th>Positif</th>
                  <th>Netral</th>
                  <th>Negatif</th>
                </tr>
              </thead>

              <tbody>
                {dataTable && dataTable.length > 0 &&
                  dataTable.map((d, i)=> (
                    <tr key={d.id}>
                      <td data-label="#">{i + 1}</td>
                      <td data-label="Data">{d.data}</td>
                      <td data-label="Positif">{d.positive}</td>
                      <td data-label="Netral">{d.neutral}</td>
                      <td data-label="Negatif">{d.negative}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <DownloadTableExcel
            filename={id + "_" + time + "_" + title}
            sheet="Book1"
            currentTableRef={tableRef.current}
          >
            <IonFabButton class="detail-fab">
              <IonIcon icon={downloadOutline}/>
            </IonFabButton>
          </DownloadTableExcel>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default UploadDetail;
