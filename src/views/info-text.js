/* eslint-disable no-unused-vars */
import {h} from 'hyperapp'

export const InfoText = () =>
  <p>Välj projektion på ursprungsdatan o ladda upp ett csv-dokument,{' '}
  klistra in en tabell nedan eller en länk till ett csv med två kolumner{' '}
  där den första är X eller N o den andra är Y eller E <br />
  Du kan ladda ned ett exempel på hur ursprungsdatan kan se ut{' '}
    <a download='rt90.csv' target='_blank' href='https://pap.as/sweref/rt90.csv'>här</a>.{' '}
  Beräkningsalgoritmerna kommer från <a href='https://latlong.mellifica.se'>latlong.mellifica.se</a>{' '}
  där finns lite mer info. Källkoden till denna app hittar ni{' '}
    <a href='https://github.com/marcusasplund/sweref-convert'>här</a>
  </p>
