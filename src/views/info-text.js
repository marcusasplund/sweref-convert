/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const InfoText = () =>
  <div>
    <p>Välj projektion på ursprungsdatan o ladda upp ett csv-dokument,{' '}
    klistra in en tabell nedan eller en länk till ett csv med två kolumner{' '}
    där den första är X eller N o den andra är Y eller E </p>
    <p>
      <b>Exempeldata:</b><br />
      x, y<br />
      6373105, 1316400<br />
      6371176, 1312784<br />
      6371447, 1318751<br />
    </p>
    <p>
      <b>Exempelfil:</b><br />
      <a download='rt90.csv' target='_blank' href='https://pap.as/sweref/rt90.csv'>https://pap.as/sweref/rt90.csv</a>
    </p>
    <p>
    Du kan välja mellan att konvertera till eller från SWEREF/RT90 och WGS84/lat,lng{' '}
    Beräkningsalgoritmerna kommer från <a href='http://latlong.mellifica.se'>latlong.mellifica.se</a>{' '}
    där finns lite mer info. Källkoden till denna app hittar ni{' '}
      <a href='https://github.com/marcusasplund/sweref-convert'>här</a>
    </p>
  </div>
